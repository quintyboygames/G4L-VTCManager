import {Box, Button, InputAdornment, Modal, TextField, Typography} from "@mui/material";
import {FormContainer, TextFieldElement} from "react-hook-form-mui";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function CreateMoneyTransactionModal({isOpen, setIsOpen}) {
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={4}>
          Create new transaction
        </Typography>
        <FormContainer onSuccess={() => console.log("yes")}
                       FormProps={{
                         'aria-autocomplete': 'none',
                         autoComplete: 'new-password'
                       }}>
          <TextFieldElement
            required
            autoComplete={'new-password'}
            margin={'dense'}
            label={'Name'}
            name={'default-text-field'}
          /><br/>
          <TextFieldElement
            required
            type={'email'}
            margin={'dense'}
            label={'Email'}
            name={'default-email-field'}
          /><br/>
          <TextFieldElement
            required
            //parseError={parseError}
            type={'email'}
            margin={'dense'}
            label={'Email with ParseError'}
            name={'default-email-field-with-parsed'}
          /><br/>
          <TextFieldElement
            margin={'dense'}
            label={'Number'}
            name={'number-text-field'}
            required
            type={'number'}
          /><br/>
          <Button type={'submit'} color={'primary'} variant={'contained'}>Submit</Button>
        </FormContainer>
      </Box>
    </Modal>
  )
}