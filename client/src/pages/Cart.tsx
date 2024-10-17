import { Text } from "@chakra-ui/react"
import { useSelector,  } from "react-redux";
import { selectAuthToken } from "../reducers/authSlice";


const Cart = () => {
    const token = useSelector(selectAuthToken);

    console.log('CART COMPONENT: ' +token);
    return(
        <Text>Cart component</Text>
    )
}

export default Cart;