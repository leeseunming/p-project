const puppeteer = require('puppeteer');
const {saveToDatabase} = require('./carddb');

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
        }

        return {
            card_name: cardName || '미정',
            annual_fee: annualFee || '없음',
            monthly_spending_requirement : monthly_spending_requirement || '없음',
            card_type: cardType,
            benefit: benefit || [],
            image_url: imageUrl || '없음',
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
            'https://www.card-gorilla.com/card/detail/258', // Oil & Life 카드 (주유)
            'https://www.card-gorilla.com/card/detail/2610', // 그린카드
            'https://www.card-gorilla.com/card/detail/2290' ,// iD ENERGY 카드
            'https://www.card-gorilla.com/card/detail/2661' ,// plug-in 카드
            'https://www.card-gorilla.com/card/detail/39' ,// Deep Oil
            'https://www.card-gorilla.com/card/detail/16', // RPM+ 카드
            'https://www.card-gorilla.com/card/detail/2467', // 신한 알뜰모아 (통신)
            'https://www.card-gorilla.com/card/detail/106', // 굿데이카드
            'https://www.card-gorilla.com/card/detail/264', // IBK olleh super 
            'https://www.card-gorilla.com/card/detail/2649', // 농협 zgm
            'https://www.card-gorilla.com/card/detail/2633', // 디지로카 paris (쇼핑)
            'https://www.card-gorilla.com/card/detail/733', // 무신사 현대카드
            'https://www.card-gorilla.com/card/detail/41', // Deep On platinum
            'https://www.card-gorilla.com/card/detail/2648', // zgm shopping
            'https://www.card-gorilla.com/card/detail/2444', // 롯데마트 MAAX
            'https://www.card-gorilla.com/card/detail/687', // 신한 Unboxing
            'https://www.card-gorilla.com/card/detail/10', // 신한 B.big (대중교통)
            'https://www.card-gorilla.com/card/detail/2408', // NH 홈타운
            'https://www.card-gorilla.com/card/detail/2690', // K-패스
            'https://www.card-gorilla.com/card/detail/142', // 톡톡 pay
            'https://www.card-gorilla.com/card/detail/2364', // id Move
            'https://www.card-gorilla.com/card/detail/129', // 청춘대로 톡톡카드 (카페)
            'https://www.card-gorilla.com/card/detail/2262', // LOCA likit
            'https://www.card-gorilla.com/card/detail/723', // 무민카드
            'https://www.card-gorilla.com/card/detail/266', // 일상의 기쁨
            'https://www.card-gorilla.com/card/detail/14', // YOLO
            'https://www.card-gorilla.com/card/detail/2070', // 뱅크샐러드 빨대
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
