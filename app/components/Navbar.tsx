"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link as LinkIcon, Mail as MailIcon } from "lucide-react";
import { Fragment } from "react";

const menuItems = [
  {
    title: "SOLIHA PYRÉNÉES BÉARN BIGORRE",
    subItems: [
      "NOS VALEURS / NOS ENGAGEMENTS",
      "EQUIPE SOLIHA PBB",
      "DÉMARCHES QUALITÉ",
      "L'ASSOCIATION SOLIHA",
      "NOS PARTENAIRES",
      "NOUS CONTACTER",
    ],
  },
  {
    title: "HABITAT & TERRITOIRES",
    subItems: [
      "MON ACCOMPAGNATEUR RÉNOV'",
      "TRAVAUX D'AMÉLIORATION LOGEMENT",
      "AUDIT ENERGIQUE",
      "DIAGNOSTIC ERGOTHÉRAPEUTE",
      "DISPOSITIFS EN COURS",
      "PRÉSENTEZ NOUS VOTRE PROJET",
    ],
  },
  {
    title: "L'AGENCE IMMOBILIÈRE SOCIALE",
    subItems: ["PRÉSENTATION", "LOUER", "GÉRER", "ACCOMPAGNER", "CONTACTER"],
  },
  {
    title: "BUREAU ACCES LOGEMENT",
    subItems: ["ACCOMPAGNEMENT PERSONNALISÉ", "CONTACTER LE BAL"],
  },
  {
    title: "PRÉVENTION EXPULSION",
    subItems: ["LA CCAPEX"],
  },
];

export default function Navbar() {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const scrollRef = useRef(false);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }

    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) {
      scrollRef.current = true;
      requestAnimationFrame(() => {
        scrollRef.current = false;
      });
    }
  }, [navbarHeight]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".menu-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navbarRef}
      className="fixed top-0 left-0 w-full p-7 flex items-center bg-white z-50 shadow-md z-1000"
    >
      {/* Menu Burger (à gauche) */}
      <div className="flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="z-50 relative">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Logo centré */}
      <div className="absolute left-1/2 transform -translate-x-1/2 max-w-full overflow-hidden">
        <div className="text-lg font-bold md:h-14 h-10">
          <a href="/">
            <img src="/logos/mainLogo.png" alt="Logo SOLIHA" className="max-w-full md:h-14 h-10" />
          </a>
        </div>
      </div>

      {/* Boutons (à droite) */}
      <div className="ml-auto flex md:gap-3 gap-1 ">
        <a
          href="https://portail.pyrenees.pactbearn.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-2 md:py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
        >
          <LinkIcon size={14} className="md:hidden" />
          <LinkIcon size={18} className="hidden md:inline" />
          <span className="hidden md:inline">Accéder au portail SOLIHA</span>
        </a>

        <a
          href="mailto:contact@soliha.fr"
          className="flex items-center gap-1 md:gap-2 px-2 py-1 md:px-2 md:py-1 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition whitespace-nowrap"
        >
          <MailIcon size={14} className="md:hidden" />
          <MailIcon size={18} className="hidden md:inline" />
          <span className="hidden md:inline">Contacter SOLIHA</span>
        </a>
      </div>

      {/* Menu latéral */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed left-0 w-full max-w-full md:w-1/4 bg-white shadow-lg flex flex-col items-center justify-center gap-2 font-medium antialiased menu-container"
            style={{
              top: `${navbarHeight}px`, // Positionne sous la navbar
              height: `calc(100vh - ${navbarHeight}px)`, // Ajuste la hauteur pour ne pas chevaucher
            }}
          >
            {menuItems.map((menu, index) => (
              <Fragment key={index}>
                <div className="w-full text-center">
                  <button
                    className="flex items-center justify-between w-full px-2 py-1 text-xs md:text-sm font-medium tracking-wide hover:text-gray-500"
                    onClick={() => setOpenMenu(openMenu === index ? null : index)}
                  >
                    {menu.title} <ChevronDown size={18} />
                  </button>
                </div>
                {index !== menuItems.length - 1 && <hr className="w-full border-t-2 border-gray-300 my-4" />}
                <AnimatePresence>
                  {openMenu === index && (
                    <Fragment>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-2 items-start text-left w-full pl-3"
                      >
                        {menu.subItems.map((subItem, subIndex) => (
                          <a key={subIndex} href={`#${subItem.toUpperCase()}`} className="py-1 px-2 hover:text-gray-500 text-xs md:text-sm">
                            {subItem}
                          </a>
                        ))}
                      </motion.div>
                      <hr className="w-full border-t-2 border-gray-300 my-4" />
                    </Fragment>
                  )}
                </AnimatePresence>
              </Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}