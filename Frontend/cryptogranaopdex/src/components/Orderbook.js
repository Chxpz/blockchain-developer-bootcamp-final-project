import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import classes from "./OrderBook.module.css";

const options = [
  {
    id: "1",
    amount: "10000",
    side: "Put",
    dueDate: "02/10/2022",
    Expired: "No",
    DaysToExpire: "60",
    premium: "200",
    spot: "0.40",
    keepersFee: "100"
  },
  {
    id: "1",
    amount: "10000",
    side: "Put",
    dueDate: "02/10/2022",
    Expired: "No",
    DaysToExpire: "60",
    premium: "200",
    spot: "0.40",
    keepersFee: "100"
  },
  {
    id: "1",
    amount: "10000",
    side: "Put",
    dueDate: "02/10/2022",
    Expired: "No",
    DaysToExpire: "60",
    premium: "200",
    spot: "0.40",
    keepersFee: "100"
  },
  {
    id: "1",
    amount: "10000",
    side: "Put",
    dueDate: "02/10/2022",
    Expired: "No",
    DaysToExpire: "60",
    premium: "200",
    spot: "0.40",
    keepersFee: "100"
  }
  
];

export default function Orderbook() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid  className={classes.gridContainer} container spacing={2}>
        <Grid item xs={1}>
          </Grid>
        <Grid className={classes.grid} item xs={10}>
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Amount</th>
                <th>Side</th>
                <th>Expiration Date</th>
                <th>Expired?</th>
                <th>Days to expire</th>
                <th>Premium</th>
                <th>Spot</th>
                <th>Keepers fee</th>
                <th>Purchase this option</th>
                <th>Settle this option</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, idx) => (
                <tr key={idx}>
                  <td>{option.id}</td>
                  <td>{option.amount}</td>
                  <td>{option.side}</td>
                  <td>{option.dueDate}</td>
                  <td>{option.Expired}</td>
                  <td>{option.DaysToExpire}</td>
                  <td>{option.premium}</td>
                  <td>{option.spot}</td>
                  <td>{option.keepersFee}</td>
                  <td className = {classes.purchase}><DoneAllIcon style={{color:'rgb(0,255,255)'}} /></td>
                  <td className = {classes.keepers}><DoneAllIcon style={{color:'violet'}} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Grid>
        <Grid item xs={1}>
          </Grid>
      </Grid>
    </Box>
  );
}

// import { Container } from '@mui/material';
// import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
// // import 'rsuite-table/lib/less/index.less'; // or 'rsuite-table/dist/css/rsuite-table.css'
// import 'rsuite-table/dist/css/rsuite-table.css';
// //https://github.com/rsuite/rsuite-table
// const dataList = [
//   { id: 1, name: 'a', email: 'a@email.com', avartar: '...' },
//   { id: 2, name: 'b', email: 'b@email.com', avartar: '...' },
//   { id: 3, name: 'c', email: 'c@email.com', avartar: '...' }
// ];

// const ImageCell = ({ rowData, dataKey, ...rest }) => (
//   <Cell {...rest}>
//     <img src={rowData[dataKey]} width="50" />
//   </Cell>
// );

// const Orderbook = () => (
//   <Container>
//     <Table style = {{
//     backgroundColor: (255,255,255),
//     marginTop: '7%'
//   }}
//    data={dataList}>
//     <Column width={150} sortable fixed resizable>
//       <HeaderCell style = {{
//     backgroundColor:'black',
//     color:'white'
//   }}>ID</HeaderCell>
//       <Cell style = {{
//     backgroundColor:'black',
//     color:'white'
//   }}
//   dataKey="id" />
//     </Column>

//     <Column width={150} sortable resizable>
//       <HeaderCell style = {{
//     backgroundColor:'black',
//     color:'white'
//   }}>Name</HeaderCell>
//       <Cell style = {{
//     backgroundColor:'black',
//     color:'white'
//   }}

//   dataKey="name" />
//     </Column>

//     <Column width={150} sortable resizable>
//       <HeaderCell style = {{
//     backgroundColor:'black',
//     color:'white'
//   }}>Email</HeaderCell>
//       <Cell style = {{
//     backgroundColor:'black',
//     color:'white'
//   }}>
//         {(rowData, rowIndex) => {
//           return <a href={`mailto:${rowData.email}`}>{rowData.email}</a>;
//         }}
//       </Cell>
//     </Column>

//     <Column style = {{
//     backgroundColor:'black',
//     color:'white'
//     }}
//     width={150} resizable>
//       <HeaderCell
//       style = {{
//         backgroundColor:'black',
//         color:'white'
//       }}>Avartar</HeaderCell>
//       <ImageCell dataKey="avartar" />
//     </Column>
//   </Table>
//   </Container >
// );

// export default Orderbook;
