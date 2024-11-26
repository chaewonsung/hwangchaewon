import './style.scss';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

window.onload = () => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /**
   *  Navigation Scroll
   */
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

  /**
   * Loading
   */
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

  /**
   * Cursor
   */
  document.body.addEventListener('mousemove', ({ clientX, clientY }) => {
    gsap.to('.cursor', {
      top: clientY,
      left: clientX,
      overwrite: true,
      duration: 0.2,
    });
  });

  /**
   * Visual
   */
  const visual = document.querySelector('.visual');

  // Visual : Mousemove
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.body.addEventListener('mousemove', onMousemove);
      } else {
        document.body.removeEventListener('mousemove', onMousemove);
      }
    });
  }).observe(visual);

  function onMousemove({ movementX, movementY }) {
    const val = 0.1;
    gsap.set('.visual', {
      perspectiveOrigin: `-=${movementX * val}px -=${movementY * val}px`,
    });
  }
  // Visual : Set Height
  function setVisualHeight() {
    const offsetBottom = visual.offsetTop + visual.offsetHeight;
    if (offsetBottom < innerHeight) {
      gsap.set(visual, { height: `+=${innerHeight - offsetBottom}px` });
    } else {
      gsap.set(visual, { clearProps: 'height' });
    }
  }
  setVisualHeight();
  ScrollTrigger.addEventListener('refreshInit', setVisualHeight);

  /**
   * Section : About
   */
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

  /**
   * Section : Work
   */
  const cursor = document.querySelector('.cursor');
  const workItems = document.querySelectorAll('.work__workItem');
  const workModal = document.querySelector('.work-modal');
  function checkImage(imageSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => resolve(img);
      img.onerror = () => reject();
    });
  }
  class Work {
    constructor(project, design, year, desc, site) {
      this.project = project;
      this.design = design;
      (this.year = year), (this.desc = desc);
      this.site = site;
      this.loadedImage = [];
      this.loadImage();
    }
    loadImage = async function () {
      for (let i = 1; i < 99; i++) {
        const imageSrc = `src/image/work-${this.project}-${i}.png`;

        try {
          const img = await checkImage(imageSrc);
          this.loadedImage.push(img);
        } catch {
          break;
        }
      }
    };
    appendHTML = () => {
      this.appendInfo();
      this.appendImage();
    };
    appendInfo = () => {
      document.querySelector('.work-modal__workInfo').innerHTML = `
         <div class="info project">
          <em class="label">project</em><em class="value">${this.project}</em>
        </div>
        <div class="info design">
          <em class="label">design</em>
          <em class="value">${this.design}</em>
        </div>
        <div class="info year">
          <em class="label">year</em>
          <em class="value">${this.year}</em>
        </div>
        <p class="desc">
          ${this.desc}
        </p>
        <div class="visit-btn-wrap">
          <a href=${this.site || '#'} class="visit-btn">visit site</a>
        </div>
      `;
    };
    appendImage = () => {
      const parentNode = document.querySelector('.work-modal__workImg');
      parentNode.innerHTML = '';
      for (let img of this.loadedImage) {
        const imgWrap = document.createElement('div');
        imgWrap.classList.add('img-wrap');
        imgWrap.appendChild(img);
        parentNode.appendChild(imgWrap);
      }
    };
  }

  const workList = {
    appknot: new Work(
      'appknot',
      '앱노트',
      2024,
      '물리 엔진 라이브러리 Matter JS와 애니메이션 라이브러리 GSAP을 사용하여 만든 총 5페이지의 인터랙티브 웹사이트입니다. 복잡한 애니메이션이 적용되어 반응형이나 모바일로 제작하지 않았습니다.',
      'https://chaewonsung.github.io/appknot/'
    ),
    dongguk: new Work(
      'dongguk',
      '동국대학교 산학협력센터',
      2024,
      '통통 튀는 색감과 아이콘을 활용한 총 4개의 레이아웃과 6개의 페이지로 이루어진 반응형 웹사이트입니다. SCSS의 함수와 for 반복문을 활용해 배경 아이콘을 배치하였습니다.',
      'https://chaewonsung.github.io/dongguk-clone/'
    ),
    qude: new Work(
      'qude',
      'qude',
      2024,
      '간단한 스크롤 애니메이션을 적용한 html 위주의 단일 페이지 반응형 웹사이트입니다.',
      'https://chaewonsung.github.io/qude/'
    ),
  };

  workItems.forEach((el) => {
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
      setTimeout(() => {
        workModal.scrollTop = 0;
      }, 0);
      workList[el.dataset.name].appendHTML();
      document.body.classList.add('modal-open');
      workModal.classList.add(el.dataset.name);
    });
  });

  document.querySelectorAll('.work-modal .close-btn').forEach((el) => {
    el.addEventListener('click', () => {
      document.body.classList.remove('modal-open');
      workModal.className = 'work-modal';
    });
  });

  /**
   * Section : Contact
   */
  const contactInfo = document.querySelector('.contact__info');

  gsap.set('.contact', {
    marginTop: () => -contactInfo.offsetHeight,
  });

  gsap.to('.gray', {
    y: -contactInfo.offsetHeight,
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

  /**
   * GSAP : Match Media
   */
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
