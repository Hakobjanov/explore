//creating scene for scroll magic
let controller;
let slideScene;
let pageScene;
let detailScene;

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
    //slideTL.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
    //cerating a scene for scrolling
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false, //for stoping /stucking it
    })
      .setTween(slideTL)
      //   .addIndicators({
      //     colorStart: "white",
      //     colorTrigger: "white",
      //     name: "slide",
      //   })
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
      //   .addIndicators({
      //     colorStart: "white",
      //     colorTrigger: "white",
      //     name: "page",
      //   })
      .setPin(slide, { pushFollowers: false }) //this is pin
      .setTween(pageTL)
      .addTo(controller);
  });
}

//other pages scroll
function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");

  slides.forEach((slide, index) => {
    const slideTL = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slide.length - 1 === index ? "end" : slides[index + 1];
    const nextImage = nextSlide.querySelector("img");
    const detailText = nextSlide.querySelector(".fashion-text");
    slideTL.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTL.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTL.fromTo(nextImage, { x: "50%" }, { x: "0%" });
    slideTL.fromTo(detailText, { y: "50%" }, { y: "0%" });
    //scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTL)
      //   .addIndicators({
      //     colorStart: "white",
      //     colorTrigger: "white",
      //     name: "detailScene",
      //   })
      .addTo(controller);
  });
}

//cursor animations
const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e) {
  //   console.log(wheel);
  mouse.style.top = e.y + "px";
  mouse.style.left = e.x + "px";
}

//hovering
function activeCursor(e) {
  const item = e.target;

  if (item.id === "logo" || item.classList.contains("burger")) {
    console.log(item.id, item.classList);
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

//barba page transitions
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSliders();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy(), pageScene.destroy(), controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        //scroll to the top
        window.scrollTo(0, 0);
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },

          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 }),
          tl.fromTo(
            ".nav-header",
            1,
            { y: "-100%" },
            { y: "0%", ease: "power2.inOut" },
            "-=1.5"
          );
      },
    },
  ],
});

//event listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);
