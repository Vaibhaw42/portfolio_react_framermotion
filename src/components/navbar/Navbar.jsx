import Sidebar from "../sidebar/Sidebar";
import "./navbar.scss"
import {motion} from "framer-motion"
const Navbar = () => {
    return (
        <div className="navbar">
            {/*Sidebar*/}
            <Sidebar/>
            <div className="wrapper">
              <motion.span initial={{opacity:0}}
              animate={{opacity:1}}
               transition={{duration:0.5}}> VAIBHAV RAI </motion.span>
              <a className="contactLink" href="#contact">Contact</a>
            </div>
        </div>
    )
};

export default Navbar;
