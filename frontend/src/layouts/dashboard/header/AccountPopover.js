import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Box, Divider, Typography, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// mocks_
import account from '../../../_mock/account';

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const timeSlots = Array.from(new Array(24 * 2)).map(
    (_, index) => `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'}`
  );

  const [time1, set1Timer] = useState('00:00');
  const [time2, set2Timer] = useState('12:00');
  const onChangeTimer1 = (event) => {
    set1Timer(event.target.value);
  };

  const onChangeTimer2 = (event) => {
    set2Timer(event.target.value);
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 300,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Grid container rowSpacing={2} columnSpacing={0} display="flex" justifyContent="center" style={{marginBottom:'20px'}}>
          <Grid item xs={10} md={10}>
            <h6> Scraping Setting </h6>
          </Grid>

          <Grid item xs={10} md={10}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label"> Timer1 </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={time1}
                label="Timer1"
                onChange={onChangeTimer1}
              >
                {timeSlots.map((answer, i) => {
                  const iIndex = i;
                  return (
                    <MenuItem key={iIndex} value={answer}>
                      {answer}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={10} md={10}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label"> Timer2 </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={time2}
                label="Timer2"
                onChange={onChangeTimer2}
              >
                {timeSlots.map((answer, i) => {
                  const iIndex = i;
                  return (
                    <MenuItem key={iIndex} value={answer}>
                      {answer}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </Popover>
    </>
  );
}
