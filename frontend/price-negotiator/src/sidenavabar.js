import React from 'react';
import { List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const SideNavbar = ({ open, onToggle }) => {
  return (
    <div style={{
      width: open ? '240px' : '60px', // Adjust width based on open state
      backgroundColor: '#f8f9fa',
      height: '100vh',
      transition: 'width 0.3s', // Smooth transition for width change
      overflow: 'hidden'
    }}>
      <IconButton onClick={onToggle} sx={{ margin: '16px' }}>
        {open ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      {open && (
        <>
          <h2>Menu</h2>
          <Divider />
          <List>
            {['Home', 'About', 'Contact'].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </div>
  );
};

export default SideNavbar;
