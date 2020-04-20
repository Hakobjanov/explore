//creating scene for scroll magic
let controller;
let slideScene;
let pageScene;

function animateSliders() {
  //init controller
  controller = new ScrollMagic.Controller();
  //animation

  //select something
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //GSAP
    //gsap.to(revealImg, 1, { x: "100%" });
    //creating a timeline of events with chaining tatum
    const slideTL = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.inOut",
      },
    });
    //(what, {from}, {to}, 'when/delay')
    slideTL.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTL.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTL.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTL.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
    //cerating a scene for scrolling
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false, //for stoping /stucking it
    })
      .setTween(slideTL)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);
    //another animation with new timelint
    const pageTL = gsap.timeline();
    let nextSlide = slide.length - 1 === index ? "end" : slides[index + 1];
    pageTL.fromTo(nextSlide, { y: "0%" }, { y: "50%" }); //stopping animation for a moment
    pageTL.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTL.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5"); //continuing

    //creating new scene(for pinng)
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%", //animation through out the screen hight
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false }) //this is pin
      .setTween(pageTL)
      .addTo(controller);
  });
}

//cursor animations
const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

//hovering
function activeCursor(e) {
  const item = e.target;

  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }

  if (item.classList.contains("explore")) {
    mouse.classList.add("exp-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerText = "GO!";
  } else {
    mouse.classList.remove("exp-active");
    mouseText.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%" });
    document.body.classList.remove("hide");
  }
}

//event listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);

animateSliders();
