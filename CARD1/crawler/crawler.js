const puppeteer = require('puppeteer');
const saveToDatabase = require('./carddb');

(async () => {
    try {
        console.log('크롤링 시작...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 크롤링할 URL 목록
        const urls = [
            'https://card-gorilla.com/card/detail/2752', // 첫 번째 카드 URL
            'https://card-gorilla.com/card/detail/2683', // 두 번째 카드 URL
            'https://card-gorilla.com/card/detail/2751', // 세 번째 카드 URL
        ];

        for (const url of urls) {
            console.log(`URL 이동: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2' });

            // CSS Selector를 통해 데이터 추출
            const cardName = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area.multi > div.tit > strong',
                el => el.innerText.trim()
            );
            const benefits = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area.multi > div.bnf1',
                el => el.innerText.trim()
            );
            const annualFee = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.bnf2',
                el => el.innerText.trim()
            );

            // 크롤링된 데이터 확인
            const cardData = {
                cardName: cardName || '미정',
                benefits: benefits || '없음',
                annualFee: annualFee || '없음',
            };
            console.log('크롤링된 데이터:', cardData);

            // 데이터 저장
            await saveToDatabase(cardData);
        }

        await browser.close();
        console.log('브라우저 닫힘. 크롤링 종료.');
    } catch (error) {
        console.error('크롤링 중 오류 발생:', error.message);
    }
})();
