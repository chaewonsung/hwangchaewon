import './style.scss';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

window.onload = () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const fullPageScrollTween = gsap
    .to(window, { scrollTo: 0, paused: true, duration: 0.8 })
    .progress(1);

  document.querySelectorAll('.nav button').forEach((el) => {
    el.addEventListener('click', () => {
      const target = document.querySelector(`section.${el.textContent}`);
      fullPageScrollTween.vars.scrollTo = target.offsetTop;
      fullPageScrollTween.invalidate().restart();
    });
  });

  gsap
    .timeline({ delay: 0.5 })
    .to('.loading .typo', { y: 0 })
    .from('.loading path', { y: 100, stagger: 0.06, clearProps: 'y' }, '<')
    .to(
      '.loading',
      { yPercent: -100, ease: 'power2.inOut', duration: 0.8 },
      '>0.2'
    )
    .to(
      '.loading .typo',
      { yPercent: 100, ease: 'power2.inOut', duration: 0.8 },
      '<'
    )
    .from(
      'header, .visual',
      {
        y: 50,
        autoAlpha: 0,
        stagger: 0.3,
        duration: 0.7,
        clearProps: 'y,opacity,visibility',
      },
      '<60%'
    );

  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.body.addEventListener('mousemove', onMousemove);
      } else {
        document.body.removeEventListener('mousemove', onMousemove);
      }
    });
  }).observe(document.querySelector('.visual'));

  function onMousemove({ movementX, movementY }) {
    const val = 0.1;
    gsap.set('.visual', {
      perspectiveOrigin: `-=${movementX * val}px -=${movementY * val}px`,
    });
  }

  function setPaddingToVisual() {
    const visual = document.querySelector('.visual');
    const offsetBottom = visual.offsetTop + visual.offsetHeight;
    if (offsetBottom < innerHeight) {
      gsap.set(visual, { height: `+=${innerHeight - offsetBottom}px` });
    } else {
      gsap.set(visual, { clearProps: 'height' });
    }
  }
  setPaddingToVisual();

  ScrollTrigger.addEventListener('refreshInit', setPaddingToVisual);

  document.body.addEventListener('mousemove', ({ clientX, clientY }) => {
    gsap.to('.cursor', {
      top: clientY,
      left: clientX,
      overwrite: true,
      duration: 0.2,
    });
  });

  gsap.utils.toArray('.about .content').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'center bottom',
      onEnter: ({ trigger }) => trigger.classList.add('in'),
      onLeaveBack: ({ trigger }) => trigger.classList.remove('in'),
    });
  });

  gsap.to('.about .content-wrap', {
    keyframes: {
      '10%': { yPercent: 0 },
      '90%': { yPercent: -101 },
    },
    stagger: 0.1,
    scrollTrigger: {
      trigger: '.about__ul',
      start: 'bottom bottom',
      endTrigger: '.about',
      end: 'bottom bottom',

      scrub: 1,
      onLeave: () => gsap.to('.about__video', { scale: 0.97 }),
      onEnterBack: () => gsap.to('.about__video', { scale: 1 }),
    },
  });

  const cursor = document.querySelector('.cursor');
  document.querySelectorAll('.work__workItem').forEach((el) => {
    const workInfo = el.querySelector('.work-info-content-wrap');
    el.addEventListener('mouseenter', (e) => {
      gsap.to(workInfo, { y: 0, opacity: 1, duration: 0.4 });
      cursor.classList.add('pointer');
    });
    el.addEventListener('mousemove', (e) => {
      gsap.to(e.currentTarget, {
        x: (i, el) => (e.offsetX - el.offsetWidth / 2) * 0.2,
        y: (i, el) => (e.offsetY - el.offsetHeight / 2) * 0.2,
        overwrite: true,
      });
    });
    el.addEventListener('mouseleave', (e) => {
      gsap.to(workInfo, {
        y: (i, el) => el.offsetHeight,
        opacity: 0,
        duration: 0.3,
        clearProps: 'y',
      });
      cursor.classList.remove('pointer');
      gsap.to(e.currentTarget, { x: 0, y: 0 });
    });

    el.addEventListener('click', () => {
      modifyWorkModal(el.dataset.name);
      document.body.classList.add('modal-open');
      document.querySelector('.work-modal').classList.add(el.dataset.name);
    });
  });

  class Work {
    constructor(project, design, year, desc, site) {
      this.project = project;
      this.design = design;
      (this.year = year), (this.desc = desc);
      this.site = site;
    }
  }
  const workList = {
    appknot: new Work(
      'appknot',
      '앱노트',
      2024,
      '이 웹사이트는ㄴ 제 어쩌구저꺼주',
      'https://chaewonsung.github.io/appknot/'
    ),
    dongguk: new Work(
      'dongguk',
      '동국대학교 산학협력센터',
      2024,
      '이 웹사이트는 어쩌구저꺼주거',
      'https://chaewonsung.github.io/dongguk-clone/'
    ),
    qude: new Work(
      'qude',
      'qude',
      2024,
      '안뇽안뇽 방가방가 ㅋㅋ안뇽안뇽 방가방가 ㅋㅋ안뇽안뇽 방가방가 ㅋㅋ안뇽안뇽 방가방가 ㅋㅋ안뇽안뇽 방가방가 ㅋㅋ안뇽안뇽 방가방가 ㅋㅋ안뇽안뇽 방가방가 ㅋㅋ'
    ),
  };

  function modifyWorkModal(target) {
    if (Object.keys(workList).includes(target)) {
      const { project, design, year, desc, site } = workList[target];
      document.querySelector('.work-modal__workInfo').innerHTML = `
         <div class="info project">
          <em class="label">project</em><em class="value">${project}</em>
        </div>
        <div class="info design">
          <em class="label">design</em>
          <em class="value">${design}</em>
        </div>
        <div class="info year">
          <em class="label">year</em>
          <em class="value">${year}</em>
        </div>
        <p class="desc">
          ${desc}
        </p>
        <div class="visit-btn-wrap">
          <a href=${site || '#'} class="visit-btn">visit site</a>
        </div>
      `;

      (async function () {
        let HTML = '';

        for (let i = 1; i < 99; i++) {
          const imageSrc = `../src/image/work-${project}-${i}.png`;

          try {
            await checkImage(imageSrc);
            HTML += `
                <div class="img-wrap">
                  <img src="${imageSrc}" alt="" />
                </div>
              `;
          } catch {
            break;
          }
        }
        document.querySelector('.work-modal__workImg').innerHTML = HTML;
      })();
    } else {
    }
  }

  function checkImage(imageSrc) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.src = imageSrc;
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
  }

  document.querySelectorAll('.work-modal .close-btn').forEach((el) => {
    el.addEventListener('click', () => {
      document.body.classList.remove('modal-open');
      document.querySelector('.work-modal').className = 'work-modal';
    });
  });

  gsap.set('.contact', {
    marginTop: () => -document.querySelector('.contact__info').offsetHeight,
  });
  // gsap.from('.gray', {
  //   y: document.querySelector('.contact__info').offsetHeight,
  //   scrollTrigger: {
  //     trigger: '.contact',
  //     end: 'bottom bottom',
  //     scrub: 0,
  //   },
  // });

  gsap.to('.gray', {
    y: -document.querySelector('.contact__info').offsetHeight,
    scaleX: 0.97,
    ease: 'none',
    scrollTrigger: {
      trigger: '.contact',
      end: 'bottom bottom',
      scrub: 1,
    },
  });

  document.querySelector('.to-top-btn').addEventListener('click', () => {
    gsap.to(window, { scrollTo: 0, duration: 0.7 });
  });

  const mm = gsap.matchMedia();
  mm.add('(min-width: 769px)', () => {
    gsap.fromTo(
      '.work h2 path',
      { yPercent: (i) => i * 50 },
      {
        yPercent: 0,
        scrollTrigger: {
          trigger: '.work',
          start: 'top center',
          end: 'top top',
          scrub: 1,
          onEnter: ({ trigger }) => {
            if (!fullPageScrollTween.isActive()) {
              gsap.to(window, {
                scrollTo: { y: trigger.offsetTop },
              });
            }
          },
          onLeaveBack: ({ trigger }) => {
            if (!fullPageScrollTween.isActive()) {
              gsap.to(window, {
                scrollTo: { y: trigger.offsetTop - innerHeight },
              });
            }
          },
        },
      }
    );
  });
};
