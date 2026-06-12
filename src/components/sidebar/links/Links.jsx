import {motion} from "framer-motion";
const variants ={
  open :{
    transition:{
      staggerChildren:0.1,
    }
  },
  closed :{
    transition:{
      staggerChildren:0.05,
      staggerDirection:-1,
    }
  }
};
const itemvariants ={
  open :{
    y:0,
    opacity:1,
  },
  closed :{
    y:50,
    opacity:0,
  }
}
const Links = ({ onNavigate }) => {

    const items =[
        { label: "Home", id: "home" },
        { label: "Portfolio", id: "portfolio" },
        { label: "Services", id: "services" },
        { label: "Contact", id: "contact" },
    ];
    return (
        <motion.div className='links' variants={variants}>
          {items.map((item) => (
            <motion.a href={`#${item.id}`} key={item.id} variants={itemvariants}
            onClick={onNavigate}
            whileHover={{scale:1.1}}
            whileTap={{scale:0.95}}
            >
               {item.label}
                </motion.a>
          ))}
        </motion.div>
    );
};

export default Links;
