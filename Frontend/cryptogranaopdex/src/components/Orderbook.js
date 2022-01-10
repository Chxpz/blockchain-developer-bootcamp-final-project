import { Container } from '@mui/material';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
// import 'rsuite-table/lib/less/index.less'; // or 'rsuite-table/dist/css/rsuite-table.css'
import 'rsuite-table/dist/css/rsuite-table.css';
//https://github.com/rsuite/rsuite-table
const dataList = [
  { id: 1, name: 'a', email: 'a@email.com', avartar: '...' },
  { id: 2, name: 'b', email: 'b@email.com', avartar: '...' },
  { id: 3, name: 'c', email: 'c@email.com', avartar: '...' }
];

const ImageCell = ({ rowData, dataKey, ...rest }) => (
  <Cell {...rest}>
    <img src={rowData[dataKey]} width="50" />
  </Cell>
);

const Orderbook = () => (
  <Container>
    <Table style = {{
    backgroundColor: (255,255,255),
    marginTop: '7%'
  }}
   data={dataList}>
    <Column width={150} sortable fixed resizable>
      <HeaderCell style = {{
    backgroundColor:'black',
    color:'white'
  }}>ID</HeaderCell>
      <Cell style = {{
    backgroundColor:'black',
    color:'white'
  }}
  dataKey="id" />
    </Column>

    <Column width={150} sortable resizable>
      <HeaderCell style = {{
    backgroundColor:'black',
    color:'white'
  }}>Name</HeaderCell>
      <Cell style = {{
    backgroundColor:'black',
    color:'white'
  }}
  
  dataKey="name" />
    </Column>

    <Column width={150} sortable resizable>
      <HeaderCell style = {{
    backgroundColor:'black',
    color:'white'
  }}>Email</HeaderCell>
      <Cell style = {{
    backgroundColor:'black',
    color:'white'
  }}>
        {(rowData, rowIndex) => {
          return <a href={`mailto:${rowData.email}`}>{rowData.email}</a>;
        }}
      </Cell>
    </Column>

    <Column style = {{
    backgroundColor:'black',
    color:'white'
    }}
    width={150} resizable>
      <HeaderCell
      style = {{
        backgroundColor:'black',
        color:'white'
      }}>Avartar</HeaderCell>
      <ImageCell dataKey="avartar" />
    </Column>
  </Table>
  </Container >
);

export default Orderbook;