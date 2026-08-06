"use client";

import { useState } from "react";

import ContactTabs from "./ContactTabs";
import ReservationForm from "./ReservationForm";
import ContactInformation from "./ContactInformation";

export default function ContactTabsWrapper({ service }: { service?: string }) {
  // 👉 toujours commencer sur réservation
  const [active, setActive] = useState<"contact" | "reservation">("reservation");

  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const handleChange = (val: "contact" | "reservation") => {
    if (val === active || animating) return;

    setAnimating(true);
    setDirection(val === "contact" ? "left" : "right");

    setTimeout(() => {
      setActive(val);
      setAnimating(false);
    }, 300);
  };

  return (
    <>
      <ContactTabs onChange={handleChange} />

      <div className="contact-form contact-form-init switch-container">
        <div
          className={`
                        switch-layer
                        ${animating ? (direction === "left" ? "slide-left" : "slide-right") : ""}
                    `}
        >
          {active === "contact" ? <ContactInformation /> : <ReservationForm service={service} />}
        </div>
      </div>
    </>
  );
}
