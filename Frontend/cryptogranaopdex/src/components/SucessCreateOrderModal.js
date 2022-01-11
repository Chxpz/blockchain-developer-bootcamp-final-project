import classes from './SucessCreateOrderModal.module.css'

function SuccessCreateOrderModal({onClose = () => {} }, children){
    return (
        <div className={classes.modal}>
            <div className={classes.container}>
            <h1>Done!</h1>
            <p>Your order has been included in the orderbook.</p>
            <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

export default SuccessCreateOrderModal;