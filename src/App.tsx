import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreateIcon from '@mui/icons-material/Create';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DataArrayIcon from '@mui/icons-material/DataArray';
import HelpIcon from '@mui/icons-material/Help';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TagIcon from '@mui/icons-material/Tag';
import WalletIcon from '@mui/icons-material/Wallet';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { tx, wallet } from '@cityofzion/neon-core-neo3';
import { reverseHex } from '@cityofzion/neon-core-neo3/lib/u';

export default function App() {
  const theme = useTheme();
  const [skinput, SKINPUT] = useState('');
  const [skerror, SKERROR] = useState(false);
  const [xtinput, XTINPUT] = useState('');
  const [xterror, XTERROR] = useState(false);
  const [dialogr, DIALOGR] = useState(false);
  const [dialogx, DIALOGX] = useState(false);
  const [dialogw, DIALOGW] = useState(false);
  const [content, CONTENT] = useState('');
  const [sk, SK] = useState<string>();
  const [xt, XT] = useState<[string, tx.Transaction]>();
  return <Dialog open={true} fullWidth>
    <DialogTitle>
      Neo Off Line Vault
      <Link sx={{ position: 'absolute', right: 16 }} target='_blank' href='https://neo-off-line.github.io'>
        <HelpIcon color='primary' />
      </Link>
    </DialogTitle>
    <DialogContent hidden={sk !== undefined}>
      <TextField
        autoFocus
        fullWidth
        variant='standard'
        placeholder='PRIVATEKEY | WIF ¡USE AT YOUR OWN RISK!'
        type='password'
        autoComplete='current-password'
        value={skinput}
        error={skerror}
        label={<KeyIcon color={skerror ? 'error' : 'primary'} />}
        onChange={(me) => {
          SKINPUT(me.target.value);
          SKERROR(false);
        }} />
      <Button
        fullWidth
        onClick={() => {
          switch (true) {
            case /^[0-9a-f]{64}$/.test(skinput):
              SKINPUT('');
              SK(skinput);
              break;
            case /^0x[0-9a-f]{64}$/.test(skinput):
              SKINPUT('');
              SK(skinput.slice(2));
              break;
            case wallet.isWIF(skinput):
              SKINPUT('');
              SK(new wallet.Account(skinput).privateKey);
              break;
            default:
              SKERROR(true);
          }
        }}>
        <LockOpenIcon />
      </Button>
    </DialogContent>
    <DialogContent hidden={sk === undefined}>
      <List>
        <ListItem>
          <Button fullWidth onClick={() => {
            XTINPUT('');
            SK(undefined);
          }}>
            <LockIcon color='primary' />
          </Button>
        </ListItem>
        <ListItem secondaryAction={
          <IconButton edge='end'
            onClick={() => {
              CONTENT(new wallet.Account(sk).address);
              DIALOGW(true);
            }}>
            <QrCodeIcon color='primary' />
          </IconButton>
        }>
          <ListItemIcon>
            <WalletIcon color='primary' />
          </ListItemIcon>
          <ListItemText primary={new wallet.Account(sk).address} primaryTypographyProps={{ fontFamily: 'monospace', noWrap: true }} />
        </ListItem>
        <ListItem secondaryAction={
          <IconButton edge='end'
            onClick={() => {
              CONTENT(`0x${new wallet.Account(sk).scriptHash}`);
              DIALOGW(true);
            }}>
            <QrCodeIcon color='primary' />
          </IconButton>
        }>
          <ListItemIcon>
            <TagIcon color='primary' />
          </ListItemIcon>
          <ListItemText primary={`0x${new wallet.Account(sk).scriptHash}`} primaryTypographyProps={{ fontFamily: 'monospace', noWrap: true }} />
        </ListItem>
        <ListItem secondaryAction={
          <IconButton edge='end'
            onClick={() => {
              CONTENT(new wallet.Account(sk).publicKey);
              DIALOGW(true);
            }}>
            <QrCodeIcon color='primary' />
          </IconButton>
        }>
          <ListItemIcon>
            <CreditCardIcon color='primary' />
          </ListItemIcon>
          <ListItemText primary={new wallet.Account(sk).publicKey} primaryTypographyProps={{ fontFamily: 'monospace', noWrap: true }} />
        </ListItem>
        <ListItem>
          <TextField
            autoFocus
            fullWidth
            variant='standard'
            placeholder='ENTER PAYLOAD AND SIGN'
            error={xterror}
            value={xtinput}
            label={<DataArrayIcon color={xterror ? 'error' : 'primary'} />}
            onChange={(me) => {
              XTINPUT(me.target.value.replace(/\s/g, ''));
              XTERROR(false);
            }} />
          <IconButton
            onClick={() => {
              DIALOGR(true);
            }}>
            <QrCodeScannerIcon color='primary' />
          </IconButton>
          <IconButton
            onClick={() => {
              try {
                const magic = xtinput.slice(0, 8);
                if (!/[0-9a-f]{8}/.test(magic)) throw new Error();
                const transaction = xtinput.slice(8);
                XT([magic, tx.Transaction.deserialize(transaction)]);
                XTINPUT('');
                DIALOGX(true);
              } catch {
                XTERROR(true);
              }
            }}>
            <CreateIcon color='primary' />
          </IconButton>
        </ListItem>
      </List>
      <Dialog open={dialogw} fullWidth>
        <DialogContent sx={{ paddingX: '16px' }}>
          <Stack alignItems='center'>
            <QRCodeSVG value={content} size={theme.breakpoints.values.sm - 32} />
            <Typography fontFamily='monospace' sx={{ wordBreak: 'break-all' }}>{content}</Typography>
            <Button fullWidth onClick={() => navigator.clipboard.writeText(content)}>
              <ContentCopyIcon color='primary' />
            </Button>
            <Button fullWidth onClick={() => DIALOGW(false)}>
              <CloseIcon color='primary' />
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogr} fullWidth>
        <DialogContent sx={{ paddingX: '16px' }}>
          <Stack alignItems='center'>
            {/* TODO */}
            <IconButton
              onClick={() => {
                DIALOGR(false);
              }}>
              <CloseIcon color='primary' />
            </IconButton>
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogx} fullWidth>
        <DialogContent>
          <Typography fontFamily='monospace' sx={{ wordBreak: 'break-all' }}>{xt ? JSON.stringify(xt[1].toJson(), null, 2) : ''}</Typography>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => {
            CONTENT(wallet.sign(`${xt![0]}${reverseHex(xt![1].hash())}`, sk!));
            DIALOGX(false);
            DIALOGW(true);
          }}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={() => DIALOGX(false)}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </DialogContent>
  </Dialog>;
}
