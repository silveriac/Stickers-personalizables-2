import './App.css';
import { useState, useEffect, useRef } from 'react';
import data from './data.json';

const params = new URLSearchParams(window.location.search);

let character = data.Personaje.find(obj => obj.alt === params.get("character"));
let hat = data.Gorro.find(obj => obj.alt === params.get("hat"));
let glasses = data.Lentes.find(obj => obj.alt === params.get("glasses"));
let other1 = data.Otro1.find(obj => obj.alt === params.get("other1"));
let other2 = data.Otro2.find(obj => obj.alt === params.get("other2"));

console.log(character, hat, glasses, other1, other2);

const share = (item) => {
    let link = "https://silveriac.github.io/Stickers-personalizables-2/?";
    console.log(item.Personaje);
    link += "character=" + item.Personaje.alt;
    link += item.Gorro ? "&hat=" + item.Gorro.alt : "";
    link += item.Lentes ? "&glasses=" + item.Lentes.alt : "";
    link += item.Otro1 ? "&other1=" + item.Otro1.alt : "";
    link += item.Otro2 ? "&other2=" + item.Otro2.alt : "";
    navigator.clipboard.writeText(link)
    console.log(link);
}

function Design({showcaseImg, generateRandom}){
    const [isVisibleAlert, setVisibilityAlert] = useState(false);
    return(
        <div id="Design" className={"showcase " + showcaseImg.Personaje.name}>
            <div onClick={() => {generateRandom()}} id="random" className='icon'>
                <img src="./assets/random.png" alt="random" />
            </div>
            <ShowCase category="Personaje" img={showcaseImg}/>
            <ShowCase category="Gorro" img={showcaseImg}/>
            <ShowCase category="Lentes" img={showcaseImg}/>
            <ShowCase category="Otro1" img={showcaseImg}/>
            <ShowCase category="Otro2" img={showcaseImg}/>
            <div  id="share" onClick={() => {share(showcaseImg)}} className='icon'>
                <img onClick={() => {
                        share(showcaseImg);
                        setVisibilityAlert(true);
                    }}
                    src="./assets/share.png" alt="share" />
            </div>
            {isVisibleAlert && <Alert setVisibility={setVisibilityAlert}/>}
        </div>
    )
}

function Alert({setVisibility}){
    setTimeout(() =>{
        setVisibility(false)
    },2400)
    return(
        <div className='alerta-copiado'>
            <p>&nbsp;&nbsp;Enlace copiado!</p>
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
                src={`./assets/${category.replace(/\d+/g, '')}/${img[category].src}`}
                alt={"main " + category}
            />}
        </>

    )
}

function Modal({category, setShowcaseImg, setActiveModal}) {
    const modalRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setActiveModal(null); // Call your close function
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setActiveModal]);
    return(
        <>
            <div onClick={() => {setActiveModal(null)}} id="close" className='icon'>
                <img src="./assets/close.png" alt="random" />
            </div>
                    <div id={category}  ref={modalRef} className="modal-viewer">
            {category != "Personaje" &&
                <div className='none'>
                    <img onClick={() => {
                        setActiveModal(null);
                        console.log(setShowcaseImg);
                        setShowcaseImg([category], null)
                    }}
                    src="./assets/none.png"
                    alt="none" />
                </div>
            }
            {data[category].map((element) => (
                <Preview image={element} category={category} handleSelect={setShowcaseImg} setActiveModal={setActiveModal} />
            ))}
        </div>
        </>
    )
}

function Preview({image, category, handleSelect, setActiveModal}) {
    return(
        <div onClick={() => {
                handleSelect(category, image);
                setActiveModal(null)}
            }
            className='miniature preview'
        >
            <img src={`./assets/${category.replace(/\d+/g, '')}/${image.src}`} alt={image.alt} />
        </div>
    )
}

function ModalSelector({category, showcaseImg, setActiveModal}) {
    const items = useRef({
        Personaje: data.Personaje[0],
        Gorro: data.Gorro[0],
        Lentes: data.Lentes[0],
        Otro1: data.Otro1[0],
        Otro2: data.Otro2[0],
    }); //use this to have a fallback when showCaseImg[category] is null
    items.current = showcaseImg[category] ? showcaseImg : items.current;
    return(
        <div onClick={() => {setActiveModal(category)}} className={"miniature " + category}>
            <img src={`./assets/${category.replace(/\d+/g, '')}/${items.current[category].src}`} alt={items.current[category].alt} />
            <p className="cat-name">{category}</p>
        </div>
    )
}

const getRandomNumber = (maxValue) => {
    return Math.floor(Math.random() * (maxValue - 1))
}

function App() {
    let initialValues = [
        data.Personaje[getRandomNumber(data.Personaje.length)],
        data.Gorro[getRandomNumber(data.Gorro.length)],
        data.Lentes[getRandomNumber(data.Lentes.length)],
        data.Otro1[getRandomNumber(data.Otro1.length)],
        data.Otro2[getRandomNumber(data.Otro2.length)]
    ]
    if(character){
        initialValues = [
            character,
            hat ? hat             : null,
            glasses ? glasses     : null,
            other1 ? other1       : null,
            other2 ? other2       : null
        ]
    } //if there are params for some of these, we don't show the others to not alter the design
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
        const numeroPersonaje = getRandomNumber(data.Personaje.length - 1);
        handleSelect("Personaje", data.Personaje[numeroPersonaje]);

        const numbers = new Set();
        while (numbers.size < 4) {
            numbers.add(Math.floor(Math.random() * 10) + 1);
        }
        const numberArray = [...numbers];
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
