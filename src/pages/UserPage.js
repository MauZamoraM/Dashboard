import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useRef } from 'react';
import { Loading, Input, Button, Spacer } from '@nextui-org/react';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import * as XLSX from 'xlsx';
// @mui
import {
  Stack,
  Container,
  Typography,
  Grid,
  TextField
} from '@mui/material';
import Box from "@mui/material/Box";
import { AccessTime } from "@mui/icons-material";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';
import Iconify from '../components/iconify';
//-------------------------------------------------------
let data;
const clients = {
  waypoints: [],
  cedis: []
}

const center = { lat: 19.315894763362834, lng: -99.29042303916954 }
const containerStyle = {
  width: '100%',
  height: '400px'
};
//--------------------------------------------------------
export default function UserPage() {
  const [shouldRenderWaypoints, setShouldRenderWaypoints] = useState(false);
  const [loading, setLoading] = useState(false);
  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries: ['places'],
  // })
  const fileInputRef = useRef();

  function readExcel(file) {
    const promise = new Promise((resolve, reject) => {
      setLoading(true);
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onloadstart = () => {
        // muestra la barra de carga o un mensaje de espera
        console.log("Cargando archivo...");
      };
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[2];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    })
    promise.then((d) => {
      // oculta la barra de carga o el mensaje de espera
      setLoading(false);
      console.log("Los datos se cargaron correctamente.");
      data = d;
      console.log(data)
    })
    // Math.random() * (to - from) + from).toFixed(fixed) * 1


  }

  function handleGenerateClick() {
    setShouldRenderWaypoints(false);
    clients.waypoints = [];
    clients.cedis = [];
    let i = 0;
    let j = 0;
    const clientes = document.getElementById("clientes").value;
    const cedis = document.getElementById("cedis").value;

    console.log(clientes, cedis); // o haga lo que necesite con estos valores
    // Agrega clientes aleatorios
    while (i < clientes) {
      clients.waypoints.push({ lat: Math.random() * (19.6 - (19.1)) + (19.1), long: Math.random() * (-98.9 - (-99.3)) + (-99.3), order: Math.floor(Math.random() * 400) + 1 });
      i += 1
    }
    while (j < cedis) {
      const camiones = [];
      let z = 0;
      while (z < Math.floor(Math.random() * 201) + 200) {
        const stdDev = (500 - 2000) / 3.29;
        let num;
        do {
          num = Math.round((Math.random() * 2 - 1) * stdDev + 2000);
        } while (num < 500 || num > 2800);
        camiones.push({ id: z, capacity: num })
        z += 1
      }
      clients.cedis.push({ lat: Math.random() * (19.6 - (19.1)) + (19.1), long: Math.random() * (-98.9 - (-99.3)) + (-99.3), camion: camiones });
      j += 1;

    }
    console.log(clients)
    setTimeout(() => setShouldRenderWaypoints(true), 1000);
    }
    
    
  
  return (
    <>
      <Helmet>
        <title> Inicio </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Bienvenido!
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
          </Button> */}
        </Stack>
        <Grid item xs={12} sm={9} display='flex' justifyContent='space-between' alignItems='center'>
          {/* <Box
            component='div'
            sx={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '1px solid E5E5E5FF',
              backgroundColor: '#e5e5e5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current.click()}
          >
            <AccessTime fontSize='medium' />
          </Box>
          <Box
            component='div'
            sx={{
              width: '80%',
              height: '100%',
              borderRadius: '12px',
              border: '1px solid #d3d3d3',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}

          >
            <Typography component='h2' fontSize={"medium"}>
              <span
                style={{ fontWeight: 'bold', color: '#2196f3', cursor: 'pointer' }}
              // onClick={ () => fileInputRef.current.click() }
              >
                Click to upload
              </span>
              , png, jpg, jpeg
            </Typography>
          </Box> */}
          <Typography variant="h5" gutterBottom>
            Escoge las siguientes opciones para generar un numero random para cada opcion:
          </Typography>

          {loading && <Loading type="points" />}
          {/* <TextField
            fullWidth
            type='file'
            id="file"
            name='file'
            value={undefined}
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }}
            sx={{ display: 'none' }}
            inputRef={fileInputRef}
            inputProps={{ accept: 'image/*' }}
          /> */}

        </Grid>
        <Box sx={{ mx: 'auto', mt: '1rem' }}>
          <Input sx={{ mb: '1rem' }} labelPlaceholder="Clientes" id="clientes" />
          <Input sx={{ mb: '1rem' }} labelPlaceholder="Cedis" id="cedis" />
          <Spacer />

        </Box>
        <Button icon={<CloudQueueIcon fill="currentColor" />} color="success" onPress={() => handleGenerateClick()} >
          Generar
        </Button>
        <Spacer />
        <LoadScript
          googleMapsApiKey="AIzaSyBLVDZMCwDct9gnHGb13nUkl7oHpEKG3Wg"
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            
          >
            {shouldRenderWaypoints && // Utiliza el estado para renderizar o no los marcadores
              clients.waypoints.map((waypoint, index) => (
                <Marker
                  key={index}
                  position={{ lat: waypoint.lat, lng: waypoint.long }}
                />
              ))}
          </GoogleMap>
        </LoadScript>
      </Container>
    </>
  );
}
