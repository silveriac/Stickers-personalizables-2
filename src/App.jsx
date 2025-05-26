import './App.css';
import { useState } from 'react';
import data from './data.json';

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // <-- Replace with your repo name
})

function Design({showcaseImg, generateRandom}){    
    return(
        <div id="Design" className={showcaseImg.Personaje.name}>
            <ShowCase category="Personaje" img={showcaseImg}/>
            <ShowCase category="Gorro" img={showcaseImg}/>
            <ShowCase category="Lentes" img={showcaseImg}/>
            <ShowCase category="Otro1" img={showcaseImg}/>
            <ShowCase category="Otro2" img={showcaseImg}/>
            <img onClick={() => {generateRandom()}} id="random" src="/assets/random.png" alt="random" />
        </div>

    )
}

function ShowCase({category, img}){
    return(
        <>
            {img[category] &&
            <img
                id={"main" + category}
                className={img[category].name}
                src={`/assets/${category.replace(/\d+/g, '')}/${img[category].src}`}
                alt={"main " + category}
            />}
        </>

    )
}

function Modal({category, setShowcaseImg, setActiveModal}) {
    return(
        <div id={category} className="modal-viewer">
            <div>
                <img src="/assets/none.png" alt="none" />
            </div>
            {data[category].map((element) => (
                <Preview image={element} category={category} setShowcaseImg={setShowcaseImg} setActiveModal={setActiveModal} />
            ))}
        </div>
    )
}

function Preview({image, category, setShowcaseImg, setActiveModal}) {
    return(
        <div onClick={() => {
            setShowcaseImg(category, image);
            setActiveModal(null)}
        }>
            <img src={`/assets/${category.replace(/\d+/g, '')}/${image.src}`} alt={image.alt} />
        </div>
    )
}

let lastItems = {
    Personaje: null,
    Gorro: null,
    Lentes: null,
    Otro1: null,
    Otro2: null,
} //use this to have a fallback when showCaseImg[category] is null //remembers previous result

function ModalSelector({category, showcaseImg, setActiveModal}) {
    lastItems[category] = showcaseImg[category] ? showcaseImg[category] : lastItems[category]
    return(
        <div onClick={() => {setActiveModal(category)}} id={category.replace(/\d+/g, '')} className="category">
            <img src={`/assets/${category.replace(/\d+/g, '')}/${lastItems[category].src}`} alt={lastItems[category].alt} />
            {/*<img src={`/assets/${category.replace(/\d+/g, '')}/${showcaseImg[category].src}`} alt={showcaseImg[category].alt} />*/}
            <p className="cat-name">{category}</p>
        </div>
    )
}

const getRandomNumber = (maxValue) => {
    return Math.floor(Math.random() * (maxValue - 1))
}

function App() {
    const initialValues = [
        data.Personaje[getRandomNumber(data.Personaje.length)],
        data.Gorro[getRandomNumber(data.Gorro.length)],
        data.Lentes[getRandomNumber(data.Lentes.length)],
        data.Otro1[getRandomNumber(data.Otro1.length)],
        data.Otro2[getRandomNumber(data.Otro2.length)]
    ]
    const [activeModal, setActiveModal] = useState(null);
    const [showcaseImg, setShowcaseImg] = useState({
        Personaje: initialValues[0],
        Gorro: initialValues[1],
        Lentes: initialValues[2],
        Otro1: initialValues[3],
        Otro2: initialValues[4]
    });

    const handleSelect = (category, content) =>{
        setShowcaseImg(prev => ({
            ...prev,
            [category]: content
        }))
    }

    const generateRandom = () =>{
        const numeroPersonaje = getRandomNumber(data.Personaje.length - 1)
        handleSelect("Nombre", data.Personaje[numeroPersonaje].name)
        handleSelect("Personaje", data.Personaje[numeroPersonaje]);

        const numbers = new Set();
        while (numbers.size < 4) {
            numbers.add(Math.floor(Math.random() * 10) + 1);
        }
        const numberArray = [...numbers];
        console.log(numberArray);
        
        handleSelect("Gorro", numberArray[0] > 2? //cada accesorio tiene una probailidad diferente de aparecer
            data.Gorro[getRandomNumber(data.Gorro.length - 1)]
            : null
        )
        handleSelect("Lentes", numberArray[1] > 4?
            data.Lentes[getRandomNumber(data.Lentes.length - 1)]
            : null
        )
        handleSelect("Otro1", numberArray[2] > 5?
            data.Otro1[getRandomNumber(data.Otro1.length - 1)]
            : null
        )
        handleSelect("Otro2", numberArray[3] > 7?
            data.Otro2[getRandomNumber(data.Otro2.length - 1)]
            : null
        )
    }

    return (
        <>
            <main>
                <Design showcaseImg={showcaseImg} generateRandom={generateRandom} />
                <div id="Name">
                    <p>{showcaseImg.Personaje.name}</p>
                </div>
            </main>
            {activeModal && <Modal category={activeModal} setShowcaseImg={handleSelect} setActiveModal={setActiveModal} />}

            <div id="Options">
                <ModalSelector category="Personaje" showcaseImg={showcaseImg} setActiveModal={setActiveModal} />
                {/* categories: character, hat, glasses, other1, other2 */}
                <ModalSelector category="Gorro" showcaseImg={showcaseImg} setActiveModal={setActiveModal} />
                <ModalSelector category="Lentes" showcaseImg={showcaseImg} setActiveModal={setActiveModal} />
                <ModalSelector category="Otro1" showcaseImg={showcaseImg} setActiveModal={setActiveModal} />
                <ModalSelector category="Otro2" showcaseImg={showcaseImg} setActiveModal={setActiveModal} />
            </div>

            <div id="mainTitle">
                <h1>¡Armá tu personaje!</h1>
            </div>
        </>
    )
}

export default App
