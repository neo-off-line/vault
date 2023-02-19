import Box from '@mui/material/Box';
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
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AbcIcon from '@mui/icons-material/Abc';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreateIcon from '@mui/icons-material/Create';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import CurrencyYuanIcon from '@mui/icons-material/CurrencyYuan';
import DataArrayIcon from '@mui/icons-material/DataArray';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import FaceIcon from '@mui/icons-material/Face';
import FunctionsIcon from '@mui/icons-material/Functions';
import HelpIcon from '@mui/icons-material/Help';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PinIcon from '@mui/icons-material/Pin';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import TagIcon from '@mui/icons-material/Tag';
import WalletIcon from '@mui/icons-material/Wallet';
import { useState } from 'react';
import { toDataURL } from 'qrcode';
import { tx, wallet } from '@cityofzion/neon-core';
import { reverseHex } from '@cityofzion/neon-core/lib/u';

const Info = (props: { content: string, icon: JSX.Element }) => {
  const [qr, QR] = useState(false);
  const [imgdata, IMGDATA] = useState('');;
  toDataURL(props.content, { margin: 0, scale: 32 }).then(IMGDATA);
  return <ListItem secondaryAction={
    <IconButton edge='end' onClick={() => QR(true)}>
      <QrCodeIcon color='primary' />
    </IconButton>
  }>
    <ListItemIcon>{props.icon}</ListItemIcon>
    <ListItemText primary={props.content} primaryTypographyProps={{ fontFamily: 'monospace', noWrap: true }} />
    <Dialog open={qr}>
      <DialogContent>
        <Box width='100%'>
          {imgdata ? <img width='100%' alt={props.content} src={imgdata} /> : <Typography fontFamily='monospace' textAlign='center' m={4}>loading...</Typography>}
          <Paper variant='outlined'>
            <Typography m={1} fontFamily='monospace' textAlign='center' overflow='auto'>{props.content}</Typography>
          </Paper>
        </Box>
        <Button fullWidth onClick={() => navigator.clipboard.writeText(props.content)}>
          <ContentCopyIcon color='primary' />
        </Button>
        <Button fullWidth disabled={!imgdata} onClick={() => QR(false)}>
          <CloseIcon color={imgdata ? 'primary' : 'disabled'} />
        </Button>
      </DialogContent>
    </Dialog>
  </ListItem>;
}

const Extract = (props: { name: string, value: string, icon: JSX.Element }) => {
  return <ListItem>
    <ListItemIcon>{props.icon}</ListItemIcon>
    <ListItemText primary={props.value} secondary={props.name} primaryTypographyProps={{ fontFamily: 'monospace', overflow: 'auto' }} />
  </ListItem>;
}

const Sign = (props: { payload: [string, tx.Transaction] | undefined, privkey: string, SET: (val: [string, tx.Transaction] | undefined) => void }) => {
  const [sig, SIG] = useState('');
  const [imgdata, IMGDATA] = useState('');;
  if (props.payload === undefined) return <></>;
  if (sig) {
    toDataURL(sig).then(IMGDATA);
    return <Dialog open={true}>
      <DialogContent>
        <Box width='100%'>
          {imgdata ? <img width='100%' alt={sig} src={imgdata} /> : <Typography fontFamily='monospace' textAlign='center' m={4}>loading...</Typography>}
          <Paper variant='outlined'>
            <Typography m={1} fontFamily='monospace' textAlign='center' overflow='auto'>{sig}</Typography>
          </Paper>
        </Box>
        <Button fullWidth onClick={() => navigator.clipboard.writeText(sig)}>
          <ContentCopyIcon color='primary' />
        </Button>
        <Button fullWidth disabled={!imgdata} onClick={() => {
          props.SET(undefined);
          SIG('');
        }}>
          <CloseIcon color={imgdata ? 'primary' : 'disabled'} />
        </Button>
      </DialogContent>
    </Dialog>;
  }
  return <Dialog open={true}>
    <DialogContent>
      <List dense>
        <Extract icon={<AbcIcon color='primary' />} value={`0x${props.payload[0]}`} name='NETWORK' />
        <Extract icon={<FunctionsIcon color='primary' />} value={`${props.payload[1].version}`} name='VERSION' />
        <Extract icon={<PinIcon color='primary' />} value={`${props.payload[1].nonce}`} name='NONCE' />
        <Extract icon={<CurrencyYenIcon color='primary' />} value={`${props.payload[1].systemFee.toDecimal(8)}`} name='SYSFEE' />
        <Extract icon={<CurrencyYuanIcon color='primary' />} value={`${props.payload[1].networkFee.toDecimal(8)}`} name='NETFEE' />
        <Extract icon={<CheckCircleIcon color='primary' />} value={`${props.payload[1].validUntilBlock}`} name='VALID UNTIL BLOCK' />
        <Extract icon={<FaceIcon color='primary' />} value={`${props.payload[1].signers.map(v => JSON.stringify(v.export()))}`} name='SIGNERS' />
        <Extract icon={<EditAttributesIcon color='primary' />} value={`${props.payload[1].attributes.map(v => JSON.stringify(v.export()))}`} name='ATTRS' />
        <Extract icon={<CodeIcon color='primary' />} value={`${props.payload[1].script}`} name='SCRIPT' />
      </List>
    </DialogContent>
    <DialogActions>
      <IconButton onClick={() => SIG(wallet.sign(`${props.payload![0]}${reverseHex(props.payload![1].hash())}`, props.privkey))}>
        <CheckIcon />
      </IconButton>
      <IconButton onClick={() => props.SET(undefined)}>
        <CloseIcon />
      </IconButton>
    </DialogActions>
  </Dialog>;
}

const Payload = (props: { SET: (val: [string, tx.Transaction] | undefined) => void }) => {
  const [input, INPUT] = useState('');
  const [error, ERROR] = useState(false);
  return <ListItem>
    <TextField
      autoFocus
      fullWidth
      variant='standard'
      placeholder='ENTER PAYLOAD AND SIGN'
      error={error}
      value={input}
      label={<DataArrayIcon color={error ? 'error' : 'primary'} />}
      onChange={(me) => {
        INPUT(me.target.value.replace(/\s/g, ''));
        ERROR(false);
      }} />
    <IconButton
      onClick={() => {
        // TODO
      }}>
      <QrCodeScannerIcon color='primary' />
    </IconButton>
    <IconButton
      onClick={() => {
        try {
          const [magic, transaction] = [input.slice(0, 8).toLowerCase(), tx.Transaction.deserialize(input.slice(8))];
          if (!/^[0-9a-fA-F]{8}$/.test(magic)) throw new Error(); else INPUT('');
          props.SET([magic, transaction]);
        } catch {
          ERROR(true);
        }
      }}>
      <CreateIcon color='primary' />
    </IconButton>
  </ListItem>;
}

const Open = (props: { SET: (val: string) => void }) => {
  const [input, INPUT] = useState('');
  const [error, ERROR] = useState(false);
  return <DialogContent>
    <TextField
      autoFocus
      fullWidth
      variant='standard'
      placeholder='PRIVATEKEY | WIF ¡USE AT YOUR OWN RISK!'
      type='password'
      autoComplete='current-password'
      value={input}
      error={error}
      label={<KeyIcon color={error ? 'error' : 'primary'} />}
      onChange={(me) => {
        INPUT(me.target.value);
        ERROR(false);
      }} />
    <Button
      fullWidth
      onClick={() => {
        switch (true) {
          case /^[0-9a-f]{64}$/.test(input):
            return props.SET(input);
          case /^0x[0-9a-f]{64}$/.test(input):
            return props.SET(input.slice(2));
          case wallet.isWIF(input):
            return props.SET(new wallet.Account(input).privateKey);
          default:
            return ERROR(true);
        }
      }}>
      <LockOpenIcon />
    </Button>
  </DialogContent>;
}

const Main = (props: { privkey: string, SET: (val: string | undefined) => void }) => {
  const [payload, PAYLOAD] = useState<[string, tx.Transaction]>();
  return <DialogContent>
    <List>
      <ListItem>
        <Button fullWidth onClick={() => props.SET(undefined)}>
          <LockIcon color='primary' />
        </Button>
      </ListItem>
      <Info icon={<WalletIcon color='primary' />} content={new wallet.Account(props.privkey).address} />
      <Info icon={<TagIcon color='primary' />} content={`0x${new wallet.Account(props.privkey).scriptHash}`} />
      <Info icon={<CreditCardIcon color='primary' />} content={new wallet.Account(props.privkey).publicKey} />
      <Payload SET={PAYLOAD} />
    </List>
    <Sign payload={payload} privkey={props.privkey} SET={PAYLOAD} />
  </DialogContent>;
}

export default function App() {
  const [privkey, PRIVKEY] = useState<string>();
  return <Dialog open={true} fullWidth>
    <DialogTitle>
      Neo Off Line Vault
      <Link sx={{ position: 'absolute', right: 16 }} target='_blank' href='https://neo-off-line.github.io'>
        <HelpIcon color='primary' />
      </Link>
    </DialogTitle>
    {privkey === undefined ? <Open SET={PRIVKEY} /> : <Main privkey={privkey} SET={PRIVKEY} />}
  </Dialog>;
}
