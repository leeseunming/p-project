const puppeteer = require('puppeteer');
const { saveToDatabase } = require('./carddb');

const detailUrls = [
    "https://www.bccard.com/app/card/CreditCardMain.do",
    "https://www.shinhancard.com/pconts/html/main.html",
    "https://www.samsungcard.com/personal/main/UHPPCO0101M0.jsp",
    "https://card.kbcard.com/CMN/DVIEW/HOAMCXPRIZZC0002?czone=_GNB_KB%B1%B9%B9%CE%C4%AB%B5%E5%B7%CE%B0%ED"
];

let urlIndex = 0;  // URL 인덱스 추적

// 데이터를 추출하는 함수
async function extractCardData(page, url) {
    try {
        console.log(`URL 이동: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // 데이터 추출
        let cardName;
        try {
            // 첫 번째 선택자로 시도
            cardName = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area.multi > div.tit > strong',
                el => el.innerText.trim()
            );
        } catch (error) {
            try {
                // 첫 번째 실패 시 두 번째 선택자로 시도
                cardName = await page.$eval(
                    '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area > div.tit > strong',
                    el => el.innerText.trim()
                );
            } catch (error) {
                cardName = '미정'; // 모든 선택자가 실패한 경우 기본값
            }
        }
        const annualFee = await page.$eval(
            '.card_detail .bnf2 dl dd.in_out',
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
            elements => elements.map(el => el.innerText.trim()).slice(0, 6)
        );

        // 이미지 URL 크롤링
        let imageUrl;
        try {
            imageUrl = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.plate_area > div > div > div.q-carousel__slides-container > div > div > img',
                el => el.src
            );
        } catch (error) {
            try {
                imageUrl = await page.$eval(
                    '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.plate_area > div > img',
                    el => el.src
                );
            } catch (error) {
                imageUrl = '없음'; // 모든 선택자가 실패한 경우 기본값
            }
        };

        const detailUrl = detailUrls[urlIndex];
        urlIndex = (urlIndex + 1) % detailUrls.length;

        return {
            card_name: cardName || '미정',
            annual_fee: annualFee || '없음',
            monthly_spending_requirement: monthly_spending_requirement || '없음',
            card_type: cardType,
            benefit: benefit || [],
            image_url: imageUrl || '없음',
            detail_url: detailUrl
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
        cardData.benefit = cardData.benefit.join('; ');

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

        urlIndex = 0;

        // 크롤링할 URL 목록
        const urls = [
            'https://www.card-gorilla.com/card/detail/2752', // the pink edition
            'https://www.card-gorilla.com/card/detail/2683', // 현대카드 Z family
            'https://www.card-gorilla.com/card/detail/2751', // the Red
            'https://www.card-gorilla.com/card/detail/2346', // BC 바로클리어 플러스
            'https://www.card-gorilla.com/card/detail/10', // 신한카드 삑
            'https://www.card-gorilla.com/card/detail/2235', // 삼성 id On
            'https://www.card-gorilla.com/card/detail/129', // 청춘대로 톡톡

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