document.addEventListener("DOMContentLoaded", function() {

    const btnOpenModal = document.querySelector("#btnOpenModal");
    const modal = document.querySelector("#modalBlock");
    const closeModal = document.querySelector(".close");
    const prevButton = document.querySelector("#prev");
    const nextButton = document.querySelector("#next");
    const sendButton = document.querySelector("#send");
    const formAnswers = document.querySelector("#formAnswers");
    const question = document.querySelector("#question");
    const modalTitle = document.querySelector(".modal-title");
    const questions = [
        {
            question: "Какого цвета бургер?",
            answers: [
                {
                    title: 'Стандарт',
                    url: './image/burger.png'
                },
                {
                    title: 'Черный',
                    url: './image/burgerBlack.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "Из какого мяса котлета?",
            answers: [
                {
                    title: 'Курица',
                    url: './image/chickenMeat.png'
                },
                {
                    title: 'Говядина',
                    url: './image/beefMeat.png'
                },
                {
                    title: 'Свинина',
                    url: './image/porkMeat.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "Дополнительные ингредиенты?",
            answers: [
                {
                    title: 'Помидор',
                    url: './image/tomato.png'
                },
                {
                    title: 'Огурец',
                    url: './image/cucumber.png'
                },
                {
                    title: 'Салат',
                    url: './image/salad.png'
                },
                {
                    title: 'Лук',
                    url: './image/onion.png'
                }
            ],
            type: 'checkbox'
        },
        {
            question: "Добавить соус?",
            answers: [
                {
                    title: 'Чесночный',
                    url: './image/sauce1.png'
                },
                {
                    title: 'Томатный',
                    url: './image/sauce2.png'
                },
                {
                    title: 'Горчичный',
                    url: './image/sauce3.png'
                }
            ],
            type: 'radio'
        }
    ];
    const finalAnswers = [];
    let currentQuestion = 1;

    btnOpenModal.addEventListener("click", playQuiz);
    closeModal.addEventListener("click", toggleModal);
    prevButton.addEventListener("click", changeQuestion);
    nextButton.addEventListener("click", changeQuestion);
    sendButton.addEventListener("click", changeQuestion);

    function toggleModal() {
        modal.classList.toggle("show");
    }

    function renderQuestion(item) {

        const {answers, type} = item;  

        answers.map((elem) => {

        formAnswers.insertAdjacentHTML("afterbegin", `

            <div class="answers-item d-flex flex-column">
                <input type="${type}" id="${elem.title}" name="answer" class="input d-none" value="${elem.title}">
                <label for="${elem.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${elem.url}" alt="burger">
                    <span>${elem.title}</span>
                </label>
            </div>
        `);
        })
    }

    function playQuiz() {
        currentQuestion = 1;
        toggleModal();
        formAnswers.textContent = "";
        question.textContent = questions[currentQuestion - 1].question;
        renderQuestion(questions[currentQuestion - 1]);
        prevButton.classList.add("hide");
        nextButton.classList.remove("hide");
        sendButton.classList.add("hide");
    }

    const sendForm = () => {
  
        let request = new XMLHttpRequest();
        request.open("POST", "server.php");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        let json = JSON.stringify(finalAnswers);
        console.log(finalAnswers);
        console.log(json);
        request.send(json);

        request.addEventListener("readystatechange", () => {
            if (request.readyState < 4) {
                console.log("loading") 
            } else if (request.readyState === 4 && request.status === 200) {
                console.log("success") 
            } else {
                console.log("failure") 
            }
        })
    }

    function changeQuestion(event) {
        
        if (event.target.classList.contains("next") && currentQuestion < questions.length) {

            checkInput();
            formAnswers.textContent = "";
            question.textContent = questions[currentQuestion].question;
            renderQuestion(questions[currentQuestion]);
            currentQuestion++

        } else if (event.target.classList.contains("prev") && currentQuestion > 1) {

            formAnswers.textContent = "";
            question.textContent = questions[currentQuestion - 2].question;
            renderQuestion(questions[currentQuestion - 2]);
            currentQuestion--
            
        } else if (event.target.classList.contains("next") && currentQuestion === questions.length) {
            checkInput();
            formAnswers.textContent = "Спасибо";
            nextButton.classList.add("hide");
            sendButton.classList.remove("hide");
            currentQuestion++;

            question.textContent = "Телефон для обратной связи"
            formAnswers.innerHTML = `

                <div class="form-group>
                <label for="numberPhone">Enter your number</label>
                <input type="phone" class="form-control" id="numberPhone">
                <div>

            `;
        } else if (event.target.classList.contains("send")) {
            checkInput();
            question.textContent = "Спасибо за пройденный тест";
            formAnswers.textContent = "";
            sendButton.classList.add("hide");
            modalTitle.textContent = "";
            sendForm();
        }

        if (currentQuestion < 2 || currentQuestion === questions.length + 1) {
            prevButton.classList.add("hide");
        } else {
            prevButton.classList.remove("hide");
        }
    }

    function checkInput() {
        const obj = {};
        const inputs = [...formAnswers.elements].filter((item) => item.checked || item.id == "numberPhone");

        if (currentQuestion > 0 && currentQuestion < questions.length + 1) {

            let n = 1;
            inputs.forEach((item, index) => {
                obj[`${index + 1}: ${questions[currentQuestion - 1].question}`] = item.value;

                for (let i in obj) {

                    if (inputs.length === 1) {

                        let ans = i;
                        let reg = / /i;
                        const find = ans.search(reg);
                        const newIndex = i.slice(find + 1);
                        obj[newIndex] = obj[i];
                        delete obj[i];

                    } else {

                        if (i === `${index + 1}: ${questions[currentQuestion - 1].question}`) {

                            let ans = i;
                            let reg = / /i;
                            const find = ans.search(reg);
                            const newIndex = i.slice(find + 1);
                            obj[`${newIndex}_${n}`] = obj[i];
                            n++;
                            delete obj[i];       
                        }    
                    }
                }               
            })
        }

        if (currentQuestion === questions.length + 1) {
            inputs.forEach((item) => {
                obj[`Номер телефона`] = item.value;
            })
        }

        finalAnswers.push(obj); 
    }
})






















































































































































