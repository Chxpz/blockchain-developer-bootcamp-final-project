import classes from "./Trade.module.css";
import OrderForm from '../components/OrderForm'
import {useState} from 'react';
import Modal from '../components/SucessCreateOrderModal';


function Trade() {
  const [modalOpen, setModalOpen] = useState(false); 
    return (
      <div className={classes.div}>
      < OrderForm onOpen = {() => setModalOpen(true)} />
      {modalOpen ? <Modal onClose = {() => setModalOpen(false)} /> : null}
      </div>
    )
      
}

export default Trade;
