import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-copy">
        © 2026 PRISCI. Todos los derechos reservados.
      </p>

      <div className="footer-derecha">
        <span>Sistema desarrollado en Argentina</span>
        <img
          src="https://flagcdn.com/w40/ar.png"
          alt="Bandera de Argentina"
          className="footer-bandera"
        />
      </div>
    </footer>
  );
}

export default Footer;