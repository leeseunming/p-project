document.addEventListener('DOMContentLoaded', function() {
  const rectangle3 = document.querySelector('.twenty-rectangle-3');
  const rectangle3_1 = document.querySelector('.twenty-rectangle-3_1');
  const rectangle5 = document.querySelector('.twenty-rectangle-5');
  const rectangle4 = document.querySelector('.twenty-rectangle-4');
  const creditText = document.querySelector('.twenty-text-wrapper-6');  // 신용카드 텍스트
  const debitText = document.querySelector('.twenty-text-wrapper-7');   // 체크카드 텍스트
  const categories = [
    {
      rectangle: document.querySelector('.rectangle-2'),
      text: document.querySelector('.text-wrapper')
    },
    {
      rectangle: document.querySelector('.rectangle-3'),
      text: document.querySelector('.text-wrapper-2')
    },
    {
      rectangle: document.querySelector('.rectangle-4'),
      text: document.querySelector('.text-wrapper-3')
    },
    {
      rectangle: document.querySelector('.rectangle-5'),
      text: document.querySelector('.text-wrapper-4')
    },
    {
      rectangle: document.querySelector('.rectangle-6'),
      text: document.querySelector('.text-wrapper-5')
    }
  ];

  // 체크카드로 전환하는 함수
  function switchToDebit() {
    rectangle3.classList.add('active');
    rectangle5.classList.add('hidden');
    rectangle3_1.classList.add('hidden');
    rectangle4.classList.add('active');
    creditText.classList.add('inactive');
    debitText.classList.add('active');
  }

  // 신용카드로 전환하는 함수
  function switchToCredit() {
    rectangle3_1.classList.remove('hidden');
    rectangle4.classList.remove('active');
    rectangle3.classList.remove('active');
    rectangle5.classList.remove('hidden');
    creditText.classList.remove('inactive');
    debitText.classList.remove('active');
  }

  // 체크카드 영역 클릭 이벤트
  rectangle5.addEventListener('click', switchToDebit);
  debitText.addEventListener('click', switchToDebit);

  // 신용카드 영역 클릭 이벤트
  rectangle3_1.addEventListener('click', switchToCredit);
  creditText.addEventListener('click', switchToCredit);
  
  function deactivateAll() {
    categories.forEach(category => {
      category.rectangle.classList.remove('active');
      category.text.classList.remove('active');
      category.rectangle.style.backgroundColor = '#fcdf7f';
      category.text.style.color = '#848484';
    });
  }

  // 각 카테고리에 클릭 이벤트 추가
  categories.forEach(category => {
    category.rectangle.addEventListener('click', function() {
      deactivateAll();
      category.rectangle.classList.add('active');
      category.text.classList.add('active');
      category.rectangle.style.backgroundColor = '#f9c20b';
      category.text.style.color = '#0d0c0c';
    });

    category.text.addEventListener('click', function() {
      deactivateAll();
      category.rectangle.classList.add('active');
      category.text.classList.add('active');
      category.rectangle.style.backgroundColor = '#f9c20b';
      category.text.style.color = '#0d0c0c';
    });
  }); 
});
