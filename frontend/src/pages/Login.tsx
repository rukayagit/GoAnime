import "../index.css"
import { useNavigate } from "react-router-dom";
import whiteBall from "../assets/white_ball.svg";
import library from "../assets/library.jpg"
import {useState} from "react";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    return (<main className="flex w-[1920px] max-h-[100vh] h-[1080px] border-[#000] rounded-[20px]">
        <aside className="rounded-l-[15px] relative w-[720px] max-h-[100vh]" style={{background: `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${library}) lightgray 50% / cover no-repeat`}}>
            <section className="relative flex top-[300px] left-[70px] flex-col gap-[20px] w-[600px] h-[350px]">
                <img className="w-[45px] h-[45px]" src={whiteBall} alt="нету"/>
                <h1 className="text-[64px] text-[#fff] font-[600] leading-[130%] m-[0px]" style={{fontFamily: "Poppins, serif"}}>GoAnime</h1>
                <p style={{fontFamily: `"Raleway", serif`}} className="text-[24px] text-[#fff] font-[600] leading [130%] m-[0]">Удобная и функциональная<br></br>онлайн аниме библиотека</p>
            </section>
            <section className="flex flex-col gap-[15px] absolute right-[0px] top-[60px]">
                <button
                    className={`font-semibold text-[18px] w-[120px] h-[50px] inline-flex justify-center items-center px-[35px] py-[16px] rounded-l-[8px] transition-all border-transparent
                    ${isLogin ? "bg-[#6D84F9] text-[#fff]" : "bg-[rgba(109,132,249,0.50)] text-[#fff]/50"}`}
                    style={{fontFamily: `"Raleway", serif`}}
                    onClick={() => setIsLogin(true)}
                >
                    Войти
                </button>
                <button
                    className={`font-semibold text-[18px] w-[120px] h-[50px] inline-flex justify-center items-center px-[14px] py-[16px] rounded-l-[8px] transition-all border-transparent
                    ${!isLogin ? "bg-[#6D84F9] text-[#fff]" : "bg-[rgba(109,132,249,0.50)] text-[#fff]/50"}`}
                    style={{fontFamily: `"Raleway", serif`}}
                    onClick={() => setIsLogin(false)}
                >
                    Регистрация
                </button>
            </section>
        </aside>
        {
        isLogin ?
            (
            <article className="bg-[#fff] w-[1200px] justify-center items-center align-center flex flex-col rounded-r-[20px]">
                <div className="w-[576px] h-fit ">
                    <section>
                        <h2 style={{fontFamily: `"Raleway", serif`}} className="text-[#27272a] justify-center text-[32px] font-medium mt-[0px]">Войти в аккаунт</h2>
                        <div className="w-[562px] h-[2px] bg-[#66666640] mb-[40px] mt-[40px]"></div>
                    </section>
                    <form>
                        <label htmlFor="name" style={{fontFamily: `"Raleway", serif`}} className="justify-start text-[#78716c] text-[16px] font-normal ml-[16px]">Логин (никнейм)</label>
                        <input type="text" id="name" name="name" className="w-[568px] h-[50px] rounded-[12px] bg-[#fff] mt-[6px] mb-[20px] border-[#666666]/35 border-solid border-[1px] text-[#000] text-[18px] pl-[10px]" autoComplete="off" required/>

                        <label htmlFor="pw" style={{fontFamily: `"Raleway", serif`}} className="justify-start text-[#78716c] text-[16px] font-normal relative left-[16px]">Пароль</label>
                        <input type="password" id="pw" name="pw" className="w-[568px] h-[50px] rounded-[12px] bg-[#fff] mt-[6px] border-[#666666]/35 border-solid border-[1px] text-[#000] text-[18px] pl-[10px]" required/>

                        <button type="submit" style={{fontFamily: `"Raleway", serif`}} className="relative left-[163px] bg-[#6D84F9] rounded-[25px] border-solid border-transparent flex justify-center align-center px-[85px] py-[17px] w-[250px] h-[70px] mt-[60px] text-[24px] text-[#fff] font-[700]">Войти</button>
                    </form>
                    <section>
                        <div className="w-[562px] h-[2px] bg-[#66666640] my-[50px]"></div>
                        <button type="submit"
                                style={{fontFamily: `"Raleway", serif`}}
                                onClick={() => navigate("/home")}
                                className="relative left-[163px] bg-[#636D9D] rounded-[25px] border-solid border-transparent flex justify-center align-center px-[24px] py-[17px] w-[250px] h-[70px] mt-[60px] text-[24px] text-[#fff] font-[700]">
                            Войти как гость
                        </button>
                    </section>
                </div>
            </article>
            ) : (
                <article
                    className="bg-[#fff] w-[1200px] justify-center items-center align-center flex flex-col rounded-r-[20px]">
                    <div className="w-[576px] h-fit ">
                        <section>
                            <h2 style={{fontFamily: `"Raleway", serif`}} className="text-[#27272a] justify-center text-[32px] font-medium mt-[0px]">Регистрация</h2>
                            <div className="w-[562px] h-[2px] bg-[#66666640] mb-[40px] mt-[40px]"></div>
                        </section>
                        <form>
                            <label htmlFor="name" style={{fontFamily: `"Raleway", serif`}} className="justify-start text-[#78716c] text-[16px] font-normal ml-[16px]">Никнейм</label>
                            <input type="text" id="name" name="name" className="w-[568px] h-[50px] rounded-[12px] bg-[#fff] mt-[6px] mb-[20px] border-[#666666]/35 border-solid border-[1px] text-[#000] text-[18px] pl-[10px]" autoComplete="off" required/>

                            <label htmlFor="pw" style={{fontFamily: `"Raleway", serif`}} className="justify-start text-[#78716c] text-[16px] font-normal relative left-[16px]">Пароль</label>
                            <input type="password" id="pw" name="pw" className="w-[568px] h-[50px] rounded-[12px] bg-[#fff] mt-[6px] border-[#666666]/35 border-solid border-[1px] text-[#000] text-[18px] pl-[10px]" required/>

                            <button type="submit" style={{fontFamily: `"Raleway", serif`}} className="relative left-[163px] bg-[#6D84F9] rounded-[25px] border-solid border-transparent flex justify-center align-center px-[20px] py-[17px] w-[250px] h-[70px] mt-[60px] text-[24px] text-[#fff] font-[700]">Создать аккаунт</button>
                        </form>
                        <section>
                            <div className="w-[562px] h-[2px] bg-[#66666640] my-[50px]"></div>
                            <button type="submit"
                                    style={{fontFamily: `"Raleway", serif`}}
                                    onClick={() => navigate("/home")}
                                    className="relative left-[123px] bg-[#636D9D] rounded-[25px] border-solid border-transparent flex justify-center align-center px-[24px] py-[17px] w-[330px] h-[70px] mt-[60px] text-[24px] text-[#fff] font-[700]">
                                Продолжить как гость
                            </button>
                        </section>
                    </div>
                </article>
            )
        }
        </main>
    );
}

export default Login;