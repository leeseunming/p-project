const puppeteer = require('puppeteer');
const {saveToDatabase} = require('./carddb');

// 데이터를 추출하는 함수
async function extractCardData(page, url) {
    try {
        console.log(`URL 이동: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // 데이터 추출
        const cardName = await page.$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area.multi > div.tit > strong',
            el => el.innerText.trim()
        );
        const annualFee = await page.$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.bnf2 > dl:nth-child(1) > dd.in_out',
            el => el.innerText.trim()
        );
        const monthly_spending_requirement = await page.$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.bnf2 > dl:nth-child(2)',
            el => el.innerText.trim()
        );
        const cardType = '신용카드'; // 고정 값

        // 혜택 정보 추출
        const benefit = await page.$$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.cmd_con.benefit > div.lst.bene_area > dl > dt > i',
            elements => elements.map(el => el.innerText.trim())
        );

        return {
            card_name: cardName || '미정',
            annual_fee: annualFee || '없음',
            monthly_spending_requirement : monthly_spending_requirement || '없음',
            card_type: cardType,
            benefit: benefit || [],
        };
    } catch (error) {
        console.error(`데이터 추출 실패 (URL: ${url}):`, error.message);
        return null;
    }
}

// 데이터 저장 로직
async function saveCardData(cardData) {
    try {
        // 혜택 데이터를 쉼표로 구분된 문자열로 변환
        cardData.benefit = cardData.benefit.join(', ');

        // 데이터 저장
        await saveToDatabase(cardData);
        console.log(`데이터 저장 성공: ${cardData.card_name}`);
    } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error.message);
    }
}

// 크롤링 메인 함수
(async () => {
    try {
        console.log('크롤링 시작...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 크롤링할 URL 목록
        const urls = [
            'https://www.card-gorilla.com/card/detail/2752',
            'https://www.card-gorilla.com/card/detail/2683',
            'https://www.card-gorilla.com/card/detail/2751',
        ];

        for (const url of urls) {
            const cardData = await extractCardData(page, url);

            if (cardData) {
                console.log('크롤링된 데이터:', cardData);
                await saveCardData(cardData);
            } else {
                console.log('데이터 추출 실패, 건너뜀.');
            }
        }

        await browser.close();
        console.log('브라우저 닫힘. 크롤링 종료.');
    } catch (error) {
        console.error('크롤링 전체 오류 발생:', error.message);
    }
})();
