import '../stylesheets/main-page.css'
import '../stylesheets/footer.css'

function Footer(){
    return (
        <div className="footer">
            <div className='footer-column'>
                <h1>Royal Residence</h1>
                <div className='footer-content'>
                    <p>ul. Dluga 13, 90-555, Łódź, Polska</p>
                    <p>Telefon: +48 987 654 321</p>
                    <p>Email: royalresidence@gmail.com</p>
                </div>
            </div>
            <div className='footer-column'>
                <h1>O nas</h1>
                <div className='footer-content'>
                   <p>Royal Residence to wyjątkowe miejsce, gdzie luksus spotyka się z wygodą, a goście doświadczają niezapomnianych chwil. Nasza historia rozpoczęła się z pasją do gościnności i zaangażowaniem w tworzenie atmosfery, która przekracza oczekiwania.</p>
                </div>
            </div>
            <div className='footer-column'>
                <h1>Szybkie linki</h1>
                <div className='footer-content'>
                    <p>Pokoje</p>
                    <p>Logowanie</p>
                    <p>Kontakt</p>
                </div>
            </div>
        </div>
      );
    
}

export default Footer;