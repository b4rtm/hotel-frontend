import Footer from "../Footer";
import Navbar from "../Navbar";


const ContactPage = () => {
    return (
        <>
            <Navbar />
                <div className="contact-page">
                    <h1>Skontaktuj się z nami</h1>
                    <p>Cieszymy się, że zainteresowałeś/aś się hotelem Royal Residence. Jesteśmy gotowi odpowiedzieć na Twoje pytania, zorganizować Twój pobyt i zapewnić Ci niezapomniane doświadczenia.</p>
                    <p>Poniżej znajdziesz wszelkie informacje kontaktowe, które pozwolą Ci skontaktować się z naszym zespołem obsługi klienta.</p>
                    <p>Adres: ul. Długa 13, 90-555, Łódź, Polska</p>
                    <p>Telefon: +48 987 654 321</p>
                    <p>Email: royalresidence@gmail.com</p>
                </div>
            <Footer />
        </>
    );
}

export default ContactPage;