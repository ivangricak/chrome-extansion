import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Fab = ({ OpenForms, FastCreateItem, user, defgroups }) => {
  console.log('user id: ', user, "defgroup: ", defgroups);
  const [isOpen, setIsOpen] = useState(false);

  const transition = { type: "spring", stiffness: 200, damping: 25 };

  return (
    <div className="fab-container">
      <motion.div
        className="fab-box"
        animate={{
          width: isOpen ? 150 : 100,
          height: isOpen ? 110 : 48,
          x: isOpen ? -25 : 0,
          y: isOpen ? -32 : 0,
        }}
        transition={transition}
      >
        <div className="menu-content-wrapper">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="menu-items-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5, transition: { duration: 0.15 } }}
                transition={{ delay: 0.1 }}
              >
                <span className="menu-item-text" onClick={() => OpenForms("CreateItem", "defgroups", defgroups[0].id)}>Add Item</span>
                <span className="menu-item-text" onClick={() => OpenForms("CreateGroup")}>Add Group</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="bottom-bar">
            <div 
                className="plus-zone"
                onClick={() => FastCreateItem(user, defgroups[0])}
            >
                <motion.div
                className="plus-icon"
                animate={{ 
                    rotate: isOpen ? 45 : 0,
                    x: isOpen ? 102 : 0 
                }}
                transition={transition}
                >
                +
                </motion.div>
            </div>
            <AnimatePresence>
                {!isOpen && (
                <motion.div
                    className="dots-zone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(true)}
                >
                    <div className="divider" />
                    <div className="dots-column">
                      <div className="dot" />
                      <div className="dot" />
                      <div className="dot" />
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
            {isOpen && (
                <div 
                className="close-trigger"
                onClick={() => setIsOpen(false)} 
                />
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default Fab;