'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  // We'll add our component logic here
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemCount, setItemCount] = useState()
  const [secondOpen, setSecondOpen] = useState(false)
  const [thirdOpen, setThirdOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [update, setUpdate] = useState()

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  const removeItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      const newQuantity = existingQuantity - quantity;
      if (newQuantity <= 0) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: newQuantity });
      }
    }
    await updateInventory();
  };

  const updateItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: quantity });
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    await deleteDoc(docRef);
    await updateInventory();
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSecondOpen = () => setSecondOpen(true)
  const handleSecondClose = () => setSecondOpen(false)

  const handleThirdOpen = (name) => {
    setItemName(name);
    setThirdOpen(true);
  }
  const handleThirdClose = () => setThirdOpen(false)


  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );



  return (
    
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={'#FCD7AD'}
    >
      <Box
          width="800px"
          paddingY={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor={'#1976d2'} 
          borderRadius="8px"
        >
          <Typography variant={'h4'} color={'white'} textAlign={'center'}>
           Your Pantry
          </Typography>
        </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, itemCount);
                setItemName('');
                setItemCount(0);
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={secondOpen}
        onClose={handleSecondClose}
        aria-labelledby="modal-second-title"
        aria-describedby="modal-second-description"
      >
        <Box sx={style}>
          <Typography id="modal-second-title" variant="h6" component="h2">
            Remove Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                removeItem(itemName, itemCount);
                setItemName('');
                setItemCount(0);
                handleSecondClose();
              }}
            >
              Remove
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={thirdOpen}
        onClose={handleThirdClose}
        aria-labelledby="modal-third-title"
        aria-describedby="modal-third-description"
      >
        <Box sx={style}>
          <Typography id="modal-third-title" variant="h6" component="h2">
            Update Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              fullWidth
              value={update}
              onChange={(e) => setUpdate(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                updateItem(itemName, update);
                setItemName('');
                setUpdate(0);
                handleThirdClose();
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>

      
      

      <Box border={'1px solid #333'}>
        
      <Box
      width="800px"
      height="100px"
      bgcolor={'#8EA8C3'}
      display={'flex'}
      justifyContent={'space-around'}
      alignItems={'center'}
    >
      <TextField
        id="search-bar"
        label="Search"
        variant="outlined"
        value={search}
        bgcolor={'#FFFFFF'}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          width: '250px', 
          height: '56px', 
          marginBottom: 0, 
        }}
      />
      <Button
        size="large"
        variant="contained"
        onClick={handleOpen}
        sx={{
          height: '56px', }}
      >
        Add New Item
      </Button>
      <Button
        variant="contained"
        onClick={handleSecondOpen}
        sx={{height: '56px', }}
      >
        Remove Current Item
      </Button>
    </Box>
        
        {/* <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button> 
        <Button variant="contained"  onClick={handleSecondOpen}>
          Remove Current Item
        </Button> */}
        <Box
          width="800px"
          height="100px"
          bgcolor={'#8EA8C3'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingX={5}
          paddingY={2}
          bgcolor={'#ADD8E6'}
        >
          <Typography variant="h5" color="#333" width="40%">
            Name
          </Typography>
          <Typography variant="h5" color="#333" width="20%">
            Quantity
          </Typography>
          <Typography variant="h5" color="#333" width="40%" textAlign="right">
            Actions
          </Typography>
        </Box>

        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              paddingX={5}
              paddingY={2}
              bgcolor={'#ADD8E6'}
              borderBottom="1px solid #ddd"
            >
              <Typography variant={'h6'} color={'#333'} width="40%">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h6'} color={'#333'} width="20%" textAlign="center">
                {quantity}
              </Typography>
              <Box display="flex" justifyContent="flex-end" width="40%">
                <Button variant="contained" onClick={() => addItem(name, 1)} sx={{ marginRight: 1 }}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name, 1)} sx={{ marginRight: 1 }}>
                  Remove
                </Button>
                <Button variant="contained" onClick={() => deleteItem(name)} color="error">
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

