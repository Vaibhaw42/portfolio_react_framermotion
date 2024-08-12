import "./services.scss";
import {motion} from "framer-motion";

const variants = {
    initial:{
        x:-500,
        y:100,
        opacity:0,
    },
    animate:{
        x:0,
        opacity:1,
        y:0,
        transition:{
            duration:1,
            staggerChildren:0.1,
        },
    },
}
const Services = () => {
    return (
        <motion.div className="services" variants={variants} initial="initial" whileInView="animate">
            <motion.div className="textcontainer" variants={variants}>
                <p>Focuses on working for your task efficiently
                     <br/>  and provide a best possible Result </p>
            <hr/>
            </motion.div>
            <motion.div className="titlecontainer" variants={variants}>
                <div className="title">
                    <img src="people.webp" alt="" />
                    <h1><motion.b whileHover={{color:"orange"}}>Unique</motion.b> Ideas 
                    </h1>
                </div>
                <div className="title"><h1>
                    <motion.b whileHover={{color:"orange"}}>For Your</motion.b> Buisness.
                    </h1>
                    <button>WHAT WE DO ?</button>
                    </div>
            </motion.div>
            <motion.div className="listcontainer" variants={variants}>
                <motion.div className="box" whileHover={{background:"lightgray", color: "black"}}>
                    <h2>Branding</h2>
                    <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </p>
                    <button> GO </button>
                </motion.div>
                <motion.div className="box"whileHover={{background:"lightgray", color: "black"}}>
                    <h2>Branding</h2>
                    <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </p>
                    <button> GO </button>
                </motion.div>
                <motion.div className="box"whileHover={{background:"lightgray", color: "black"}}>
                    <h2>Branding</h2>
                    <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
                    </p>
                    <button> GO </button>
                </motion.div>
                <motion.div className="box"whileHover={{background:"lightgray", color: "black"}}>
                    <h2>Branding</h2>
                    <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    </p>
                    <button> GO </button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
};

export default Services;
