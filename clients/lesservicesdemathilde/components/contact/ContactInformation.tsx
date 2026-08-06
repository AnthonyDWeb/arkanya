import { Clock, Mail, MapPin, Phone } from "@arkanya/icons";

export default function ContactInformation() {
  return (
    <div
      style={{
        border: "1px solid #EDEDED",
        borderRadius: "1.5rem",
        padding: "1.5rem",
        background: "#FFFFFF",
      }}
    >
      <h2
        className="text-2xl font-semibold mb-6 flex items-center gap-2"
        style={{ color: "#809877" }}
      >
        <MapPin size={24} className="text-[#809877]" />
        Informations de contact
      </h2>

      <div className="space-y-4 text-[#444444]">
        <div className="flex items-center gap-3">
          <Phone size={22} className="text-[#809877]" />
          <p>
            <strong>Téléphone :</strong> 07 49 44 84 65
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={22} className="text-[#809877]" />
          <p>
            <strong>Email :</strong> contact@lesservicesdemathilde.fr
          </p>
        </div>

        <div className="flex items-start gap-3">
          <MapPin size={22} className="text-[#809877] mt-1" />
          <p>
            <strong>Zones couvertes :</strong>
            <br />
            La Ferté-Gaucher, Coulommiers et alentours
          </p>
        </div>

        <div className="flex items-start gap-3 pt-2">
          <Clock size={22} className="text-[#809877] mt-1" />
          <p>
            <strong>Horaires :</strong>
            <br />
            Lundi — Vendredi : 08h30 – 18h00
          </p>
        </div>
      </div>
    </div>
  );
}
