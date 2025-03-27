const express = require('express');
const mongoose = require('mongoose');
const { FieldValue, Timestamp, Filter } = require('firebase-admin').firestore;
const jwt = require("jsonwebtoken");
const CryptoJS = require('crypto-js');
const cookieParser = require('cookie-parser');
const mement = require('moment');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');


//firebase
var admin = require("firebase-admin");
var serviceAccount = require("./spooning-4246d.json");
const { render } = require('ejs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


const app = express();
const PORT = 3002 || process.env.PORT;

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views','./views');

let sidebarOpen = true;

const pro_education = [
  "고등학교졸업",
  "전문대학교",
  "대학교",
  "대학원",
];

const pro_gender = [
  "남성",
  "여성",
];

//취미
const pro_hobby = [
  "재테크",
  "반려동물",
  "영화",
  "드라마",
  "예능",
  "음악감상",
  "악기연주",
  "노래",
  "사진",
  "여행",
  "캠핑",
  "산책",
  "자전거",
  "요가",
  "필라테스",
  "헬스",
  "테니스",
  "서핑",
  "골프",
  "러닝",
  "야구",
  "축구",
  "스포츠관람",
  "운동",
  "술",
  "와인",
  "위스키",
  "맛집투어",
  "드라이브",
  "봉사활동",
  "댄스",
  "공연",
  "전시회",
  "독서",
  "낚시",
  "SNS",
  "웹툰",
  "DIY",
  "쇼핑",
  "인테리어",
  "뷰티",
  "카페",
  "부동산",
  "주식"
];

//성격
const pro_char = [
  "지적인",
  "차분한",
  "유머있는",
  "낙천적인",
  "내향적인",
  "외향적인",
  "감성적인",
  "상냥한",
  "귀여운",
  "열정적인",
  "듬직한",
  "개성있는"
];

//직업
const pro_job = [
  "CEO", "의사", "개인사업", "변호사", "아나운서", "사업기획", "승무원", "애널리스트", "펀드매니저", "교사", "약사", "투자업", "한의사", "치과의사", "수의사",
  "은행원", "스포츠선수", "첼리스트", "작곡가", "가수", "무용수", "디자이너", "방송인", "모델", "연주자", "대학원(석사)", "대학원(박사)", "판사", "변리사", "법무사",
  "세무사", "5급공무원", "회계사", "감정평가사", "파일럿", "사무관", "국회의원", "비서관", "시의원", "구의원", "MD", "교직원", "공무원", "기자", "앵커", "캐스터",
  "PD", "작가", "건설업", "마케터", "요리사", "치위생사", "간호사", "간호조무사", "연구원", "플로리스트", "물리치료사", "국내영업", "해외영업", "호텔리어", "영양사",
  "의료기사", "미용사", "관세사", "피부관리사", "임대업자", "큐레이터", "무역업", "노무사", "임상병리사", "스포츠강사", "무용강사", "사회복지사", "일반사무직", "학부",
  "프리랜서", "기타"
];

//지역
const pro_region = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치도",
  "경기도",
  "강원도특별자치도",
  "충북",
  "충남",
  "전북특별자치도",
  "전남",
  "경북",
  "경남",
  "제주도특별자치도"
];

const pro_regi = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주"
];

const pro_mbti = [
  "ISTJ(소금형)",
  "ISFJ(권력형)",
  "INFJ(예언자형)",
  "INTJ(과학자형)",
  "ISTP(백과사전형)",
  "ISFP(성인군자형)",
  "INFP(잔다르크형)",
  "INTP(아이디어형)",
  "ESTP(활동가형)",
  "ESFP(사교형)",
  "ENFP(스파크형)",
  "ENTP(발명가형)",
  "ESTJ(사업가형)",
  "ESFJ(친선도모형)",
  "ENFJ(언변능숙형)",
  "ENTJ(지도자형)"
];

const pro_height = [
  "145cm",
  "146cm",
  "147cm",
  "148cm",
  "149cm",
  "150cm",
  "151cm",
  "152cm",
  "153cm",
  "154cm",
  "155cm",
  "156cm",
  "157cm",
  "158cm",
  "159cm",
  "160cm",
  "161cm",
  "162cm",
  "163cm",
  "164cm",
  "165cm",
  "166cm",
  "167cm",
  "168cm",
  "169cm",
  "170cm",
  "171cm",
  "172cm",
  "173cm",
  "174cm",
  "175cm",
  "176cm",
  "177cm",
  "178cm",
  "179cm",
  "180cm",
  "181cm",
  "182cm",
  "183cm",
  "184cm",
  "185cm",
  "186cm",
  "187cm",
  "188cm",
  "189cm",
  "190cm",
  "191cm",
  "192cm",
  "193cm",
  "194cm",
  "195cm",
  "196cm",
  "197cm",
  "198cm",
  "190cm",
  "191cm",
  "192cm",
  "193cm",
  "194cm",
  "195cm",
  "196cm",
  "197cm",
  "198cm",
  "199cm",
  "200cm",
];

//체형
const pro_body = ["아주마름", "마름", "약간마름", "보통", "약간통통", "통통", "뚱뚱"];
const pro_smoke = ["피움", "안피움"];
const pro_drinking = ["안함", "조금함", "보통함", "술고래"];
const pro_religion = ["무교", "기독교", "불교", "원불교", "이슬람교"];
const pro_ability = ["심사중", "반려됨", "인증완료"];


const dbURI = 'mongodb+srv://vinchi:7614015b@cluster0.gdtvf.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { }).then((result) => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    })
  }).catch((err) => console.log(err));



app.get('/', requireAuth, async (req, res) => {
  const locals = {
    title: "대쉬보드 | 썸푸닝",
    description: "썸푸닝 대쉬보드 입니다."
  };
  
  // get total count
  const total = await getTotalUsers();
  const todayUsers = await getUsersSignUpToday();
  const today = getTodayDate();
  const month = getMonthDate();
  const moneys = await db.collectionGroup('buyDia').get();
  let totalToday = 0;
  let totalMonth = 0;
  moneys.docs.forEach((money) => {
    if(money.data().buyDate.toDate() >= today) {
      let a = money.data().price.replaceAll(',', '');
      totalToday += parseInt(a);
    }
    if(money.data().buyDate.toDate() >= month) {
      let a = money.data().price.replaceAll(',', '');
      totalMonth += parseInt(a);
    }
  });
  
  const snapshot = await db.collection('users').get();
  const usersRevenue = [];
  let top5 = [];
  for(const userDoc of snapshot.docs) {
    const userId = userDoc.id;
    const user = userDoc.data();
    
    const buySnapshot = await db.collection(`users/${userId}/buyDia`).get();
    
    let todayRevenue = 0;
    let monthRevenue = 0;
    buySnapshot.forEach(doc => {
      if(doc.data().buyDate.toDate() >= today) {
        let a = doc.data().price.replaceAll(',', '');
        todayRevenue += parseInt(a);
      }
      if(doc.data().buyDate.toDate() >= month) {
        let a = doc.data().price.replaceAll(',', '');
        monthRevenue += parseInt(a);
      }
      
    });
    
    usersRevenue.push({userId, user, todayRevenue: todayRevenue, monthRevenue: monthRevenue});
    
    usersRevenue.sort((a, b) => b.monthRevenue - a.monthRevenue);
    top5 = usersRevenue.slice(0, 5);
    
  }
  
  res.render('home', {
    locals: locals,
    activeMenu: 'menu1', 
    sidebar: sidebarOpen, 
    total: total, 
    todays: todayUsers,
    totalToday: totalToday,
    totalMonth: totalMonth,
    top5: top5
  });
});

app.get('/sp_users', requireAuth, async (req, res) => {
  const locals = {
    title: "유저관리 | 썸푸닝",
    description: "썸푸닝 유저관리 입니다."
  };
  
  const snapshot = await db.collection('users').orderBy('createDate', 'desc').get();
  var users = [];
  for(const userDoc of snapshot.docs) {
    const userId = userDoc.id;
    const user = userDoc.data();
    
    users.push(user);
  }
  
  res.render('sp_users', {
    locals: locals,
    activeMenu: 'menu2', 
    sidebar: sidebarOpen,
    users: users,
    ability: pro_ability
  });
});

app.get('/chatting', requireAuth, async (req, res) => {
  const uid = req.query.uid || 0;
  let num = req.query.num || 0;
  
  if(num > 0) {
    num = num - 1;
  }
  // console.log(uid, num);
  
  const locals = {
    title: "채팅리스트 | 썸푸닝",
    description: "썸푸닝 채팅리스트 입니다."
  };
  
  let data = {};
  let listChat = [];
  let chattings = [];
  
  const snapshot = await db.collection('chatRoom').where('type', '==', 0).orderBy('regDate', 'desc').get();
  
  for(let i=0 ; i<snapshot.docs.length ; i++) {
    let chatting = {};
    if(uid == 0 && i == 0) {
      const s = await db.collection('chatRoom').doc(snapshot.docs[i].id).collection('chats').orderBy('time', 'asc').get();
      s.docs.forEach(chat => {
        listChat.push(chat.data());
      });
    } else if(uid == snapshot.docs[i].id) {
      const s = await db.collection('chatRoom').doc(uid).collection('chats').orderBy('time', 'asc').get();
      s.docs.forEach(chat => {
        listChat.push(chat.data());
      });      
    }
    
    let users = [];
    for(let j=0 ; j<snapshot.docs[i].data().members.length ; j++) {
      const snap = await db.collection('users').doc(snapshot.docs[i].data().members[j]).get();
      users.push(snap.data());
    }
  
    chatting.chat = snapshot.docs[i].data();
    chatting.users = users;
    
    chattings.push(chatting);
  }
  
  data.chattings = chattings;
  data.listChat = listChat;
  data.num = num;
  
  res.render('chatting', {
    locals: locals,
    activeMenu: 'menu3', 
    sidebar: sidebarOpen,
    data: data
  });
});

app.get('/party', requireAuth, async (req, res) => {
  let uid = req.query.uid || 0;
  let num = req.query.num || 0;
  
  if(num > 0) {
    num = num - 1;
  }
  
  const locals = {
    title: "파티리스트 | 썸푸닝",
    description: "썸푸닝 파티리스트 입니다."
  };
  
  let data = {};
  let listChat = [];
  let chattings = [];
  
  const snapshot = await db.collection('partyCard').where('type', '==', 0).orderBy('createDate', 'desc').get();
  
  for(let i=0 ; i<snapshot.docs.length ; i++) {
    let chatting = {};
    if(uid == 0 && i == 0) {
      const s = await db.collection('partyCard').doc(snapshot.docs[i].id).collection('chats').orderBy('time', 'asc').get();
      s.docs.forEach(chat => {
        listChat.push(chat.data());
      });
    } else if(uid == snapshot.docs[i].id) {
      const s = await db.collection('partyCard').doc(uid).collection('chats').orderBy('time', 'asc').get();
      s.docs.forEach(chat => {
        listChat.push(chat.data());
      });      
    }
    
    let users = [];
    for(let j=0 ; j<snapshot.docs[i].data().members.length ; j++) {
      const snap = await db.collection('users').doc(snapshot.docs[i].data().members[j]).get();
      users.push(snap.data());
    }
  
    chatting.chat = snapshot.docs[i].data();
    chatting.users = users;
    
    chattings.push(chatting);
  }
  
  data.chattings = chattings;
  data.listChat = listChat;
  data.num = num;
  
  res.render('party', {
    locals: locals,
    activeMenu: 'menu4', 
    sidebar: sidebarOpen,
    data: data
  });
});

app.get('/shorts_gram', requireAuth, async (req, res) => {
  const locals = {
    title: "쇼츠/일상생활 | 썸푸닝",
    description: "썸푸닝 쇼츠/일상생활 입니다."
  };
  try {
  
    let videos = [];
    let audios = [];
    let grams = [];
    
    let snapshot = await db.collection('shortVideoCard').where('type', '==', 0).orderBy('createDate', 'desc').get();
    for(let i=0 ; i<snapshot.docs.length ; i++) {
      videos.push(snapshot.docs[i].data());
    }
    
    snapshot = await db.collection('shortVoiceCard').where('type', '==', 0).orderBy('createDate', 'desc').get();
    for(let i=0 ; i<snapshot.docs.length ; i++) {
      audios.push(snapshot.docs[i].data());
    }
    
    snapshot = await db.collection('gramCard').where('type', '==', 0).orderBy('createDate', 'desc').get();
    for(let i=0 ; i<snapshot.docs.length ; i++) {
      grams.push(snapshot.docs[i].data());
    }
  
    res.render('shorts_gram', {
      locals: locals,
      activeMenu: 'menu5', 
      sidebar: sidebarOpen,
      videos: videos,
      audios: audios,
      grams: grams
    });
  } catch(error) {
    console.log(error);  
  }
});

app.get('/sales', requireAuth, async (req, res) => {
  const uid = req.query.uid || 0;
  const num = req.query.num || 0;
  const start = req.query.start || '2024-04-01'
  const end = req.query.end || `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2,'0')}-${new Date().getDate().toString().padStart(2, '0')}`;
  
  const locals = {
    title: "매출관리 | 썸푸닝",
    description: "매출관리 입니다."
  };
  
  try {   
    // 매일의 매출을 저장할 객체
    const dailyRevenue = {};
    let revenueDates = [];
    let revenueDays = [];
    
    
    // users 컬렉션에서 문서 가져오기
    db.collection('users').get().then((querySnapshot) => {
        const promises = [];
        querySnapshot.forEach((userDoc) => {
          const buyDiaCollection = userDoc.ref.collection('buyDia');
    
          // buyDia 컬렉션의 모든 문서 가져오기
          const promise = buyDiaCollection.get().then((buyDiaSnapshot) => {
              buyDiaSnapshot.forEach((buyDoc) => {
                const buyDate = buyDoc.data().buyDate.toDate().toISOString().split('T')[0]; // 날짜만 추출
                const price = parseInt(buyDoc.data().price.replaceAll(',', ''));
    
                // 매일의 매출 합 구하기
                if (dailyRevenue[buyDate]) {
                  dailyRevenue[buyDate] += price;
                } else {
                  dailyRevenue[buyDate] = price;
                }
              });
            })
            .catch((error) => {
              console.error('buyDia 컬렉션에서 문서를 가져오는 동안 오류 발생:', error);
            });
    
          promises.push(promise);
        });
    
        return Promise.all(promises);
      }).then(() => {
        // 모든 날짜에 대해 매출이 0인 경우 0으로 설정
        // const startDate = new Date('2024-04-01');
        // const endDate = new Date();
    
        for (let date = new Date(start); date <= new Date(end); date.setDate(date.getDate() + 1)) {
          const formattedDate = date.toISOString().split('T')[0];
          if (!dailyRevenue[formattedDate]) {
            dailyRevenue[formattedDate] = 0;
          }
        }
    
        // 매출 데이터를 날짜별로 소팅 (최근 날짜가 먼저 오도록)
        const sortedDailyRevenue = Object.keys(dailyRevenue)
          .sort((a, b) => new Date(b) - new Date(a))
          .reduce((acc, date) => {
            acc[date] = dailyRevenue[date];
            return acc;
          }, {});
    
        // 소팅된 매출 데이터 출력
        Object.keys(sortedDailyRevenue).forEach((date) => {
          // console.log(`${date}: ${sortedDailyRevenue[date]}`);
          if(date >= start && date <= end) {
            revenueDates.push(date);
            revenueDays.push(sortedDailyRevenue[date]);
          }
          
        });
        
        let sum = 0;
        let cumulative = new Array(revenueDays.length);
        for(let i=revenueDays.length-1 ; i>=0 ; i--) {
          sum += revenueDays[i];
          cumulative[i] = sum;
        }
        
        getUsersRevenue().then((revenues) => {
          res.render('sales', {
            locals: locals,
            activeMenu: 'menu6', 
            sidebar: sidebarOpen,
            revenueDates: revenueDates,
            revenueDays: revenueDays,
            cumulative: cumulative,
            revenues: revenues
          });
        }).catch((error) => {
          console.error('error');
        });
      })
      .catch((error) => {
        console.error('users 컬렉션에서 문서를 가져오는 동안 오류 발생:', error);
      });
  } catch(error) {
    console.log(error);
  }
});

const getUsersRevenue = () => {
  return new Promise((resolve, reject) => {
    const usersRevenue = [];
    
    const today = new Date().toISOString().split('T')[0];

    // users 컬렉션에서 문서 가져오기
    db.collection('users').get().then((querySnapshot) => {
        const userPromises = [];

        querySnapshot.forEach((userDoc) => {
          const username = userDoc.data().username;
          const userId = userDoc.id;
          const buyDiaCollection = userDoc.ref.collection('buyDia');
          
          const userPromise = new Promise((resolve, reject) => {
            let totalRevenue = 0;
            let todayRevenue = 0;

            // buyDia 컬렉션의 오늘 매출 구하기
            buyDiaCollection.where('buyDate', '==', new Date(today)).get()
              .then((todayBuySnapshot) => {
                todayBuySnapshot.forEach((todayBuyDoc) => {
                  todayRevenue += parseInt(todayBuyDoc.data().price.replaceAll(',', ''));
                });

                // buyDia 컬렉션의 모든 매출 누적하기
                buyDiaCollection.get().then((buyDiaSnapshot) => {
                    buyDiaSnapshot.forEach((buyDoc) => {
                      totalRevenue += parseInt(buyDoc.data().price.replaceAll(',', ''));
                    });

                    // 사용자의 매출 정보 저장
                    usersRevenue.push({
                      username: username,
                      userId: userId,
                      todayRevenue: todayRevenue,
                      totalRevenue: totalRevenue
                    });

                    resolve();
                  })
                  .catch((error) => reject(error));
              })
              .catch((error) => reject(error));
          });

          userPromises.push(userPromise);
        });

        Promise.all(userPromises)
          .then(() => resolve(usersRevenue))
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
}

app.get('/coupon', requireAuth, async (req, res) => {
  const locals = {
    title: "쿠폰관리 | 썸푸닝",
    description: "쿠폰관리 페이지 입니다."
  };
  
  res.render('coupon', {
    locals: locals,
    activeMenu: 'menu7',
    sidebar: sidebarOpen, 
  })
});

app.get('/push', requireAuth, async (req, res) => {
  let uid = req.query.uid || 0;
  let num = req.query.num || 0;
  
  const locals = {
    title: "푸쉬 | 썸푸닝",
    description: "푸쉬페이지 입니다."
  };
  
  try {
    let data = {};
    
    let users = [];
    let pushs = [];
    let snapshot = await db.collection('users').orderBy('createDate', 'desc').get();
    for(let i=0 ; i<snapshot.docs.length ; i++) {
      users.push(snapshot.docs[i].data());
    }
    
    snapshot = await db.collection('pushCard').orderBy('regDate', 'desc').get();
    for(let j=0 ; j<snapshot.docs.length ; j++) {
      pushs.push(snapshot.docs[j].data());
    }
    
    data.users = users;
    data.pushs = pushs;
    data.num = num;
    
    res.render('push', {
      locals: locals,
      activeMenu: 'menu8', 
      sidebar: sidebarOpen, 
      data: data
    });
  } catch(error) {
    console.log(error);
  }
});

app.get('/announcement', requireAuth, async (req, res) => {
  const locals = {
    title: "공지사항 | 썸푸닝",
    description: "공지사항 페이지 입니다."
  };
  
  let notices = [];
  const snapshot = await db.collection('noticeCard').orderBy('regDate', 'desc').get();
  snapshot.docs.forEach((doc) => {
    notices.push(doc.data());
  });
  
  res.render('announcement', {
    locals: locals,  
    activeMenu: 'menu9', 
    sidebar: sidebarOpen, 
    notices: notices
  });
});

app.get('/announcement-edit', requireAuth, async (req, res) => {
  const docId = req.query['docId'];
  
  console.log(docId);
  
  const locals = {
    title: "공지사항수정 | 썸푸닝",
    description: "공지사항수정 페이지 입니다."
  };
  
  const snapshot = await db.collection('noticeCard').doc(docId).get();
  const notice = snapshot.data();
  
  res.render('announcement-edit', {
    locals: locals,  
    activeMenu: 'menu9', 
    sidebar: sidebarOpen, 
    notice: notice
  });
});

app.post('/announcement-edit', requireAuth, async (req, res) => {
  let notice = req.body;
  
  console.log(notice);
  const regDate = new Date(); // 현재 날짜 및 시간을 가져옴
  const timestamp = admin.firestore.Timestamp.fromDate(regDate);
  notice.regDate = timestamp;
  notice.type = 0;
  
  await db.collection('noticeCard').doc(notice.docId).update(notice);
  
  res.redirect('/announcement');
  
});

app.get('/report', requireAuth, async (req, res) => {  
  const locals = {
    title: "신고관리 | 썸푸닝",
    description: "신고관리 페이지 입니다."
  };
  
  db.collection('reportCard').get().then((querySnapshot) => {
    const promises = [];
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      const noticeData = doc.data();
      const uid = noticeData.uid;
      
      const getUserPromise = db.collection('users').doc(uid).get().then((userDoc) => {
        const userData = userDoc.data();
        reports.push({
          id: doc.id,
          report: noticeData.report,
          regDate: noticeData.regDate,
          user: userData
        });
      });
      
      promises.push(getUserPromise);
    });
    
    Promise.all(promises).then(() => {
      res.render('report', {
        locals: locals,
        activeMenu: 'menu10', 
        sidebar: sidebarOpen,
        reports: reports
      });
    });
  })
});

app.get('/guide', requireAuth, async (req, res) => {
  const locals = {
    title: "썸푸닝가이드 | 썸푸닝",
    description: "썸푸닝가이드 페이지 입니다."
  };
  
  let guides = [];
  const snapshot = await db.collection('guideCard').orderBy('writeDate', 'desc').get();
  snapshot.docs.forEach((doc) => {
    guides.push(doc.data());
  });
  res.render('guide', {
    locals: locals,
    activeMenu: 'menu11', 
    sidebar: sidebarOpen,
    guides: guides
  });
});

app.get('/guide-edit', requireAuth, async (req, res) => {
  const docId = req.query['docId'];
  
  const locals = {
    title: "썸푸닝가이드수정 | 썸푸닝",
    description: "썸푸닝가이드수정 페이지 입니다."
  };
  
  const snapshot = await db.collection('guideCard').doc(docId).get();
  const guide = snapshot.data();
  
  res.render('guide-edit', {
    locals: locals,
    activeMenu: 'menu11', 
    sidebar: sidebarOpen,
    guide: guide
  });
});

app.post('/guide-edit', requireAuth, async (req, res) => {
  let guide = req.body;
  
  const regDate = new Date(); // 현재 날짜 및 시간을 가져옴
  const timestamp = admin.firestore.Timestamp.fromDate(regDate);
  
  guide.writeDate = timestamp;
  guide.kind = 0;
  
  const locals = {
    title: "썸푸닝가이드수정 | 썸푸닝",
    description: "썸푸닝가이드수정 페이지 입니다."
  };
  
  const snapshot = await db.collection('guideCard').doc(guide.uid).update(guide);
  
  res.redirect('/guide')
  
});

app.get('/user_profile', requireAuth, async (req, res) => {
  const slug = req.query['slug'];
  const uid = req.query['uid'];
  
  const locals = {
    title: "유저계정 | 썸푸닝",
    description: "유저계정 페이지 입니다."
  };
  
  const snapshot = await db.collection('users').doc(uid).get();
  const user = snapshot.data();
  
  
  res.render('user_profile', {
    locals: locals,
    activeMenu: slug, 
    sidebar: sidebarOpen, 
    user: user, 
    region: pro_region, 
    education: pro_education, 
    job: pro_job,
    height: pro_height,
    body: pro_body,
    mbti: pro_mbti,
    smoke: pro_smoke,
    drink: pro_drinking,
    religion: pro_religion,
    chars: pro_char,
    hobby: pro_hobby,
    youDrink: pro_drinking,
    youSmoke: pro_smoke,
    youReligion: pro_religion,
    youChar: pro_char
  });
});

app.get('/toggleSidebar', (req, res) => {
  sidebarOpen = !sidebarOpen;
  res.redirect('back');
});

app.post('/addNotice', requireAuth, async (req, res) => {
  const { title, content } = req.body;
  
  const regDate = new Date(); // 현재 날짜 및 시간을 가져옴
  const timestamp = admin.firestore.Timestamp.fromDate(regDate);
  
  db.collection('noticeCard').add({
    'type': 0,
    'regDate': timestamp,
    'title': title,
    'content': content,
    'confirm': false
  }).then(async (docRef) => {
    db.collection('noticeCard').doc(docRef.id).update({'docId': docRef.id});
    res.redirect('/announcement');
  }).catch((error) => {
    console.error('error adding notice: ', error);
    res.status(500).send('error');
  })
  
});

app.post('/addGuide', requireAuth, async (req, res) => {
  const { title, content } = req.body;
  
  const regDate = new Date(); // 현재 날짜 및 시간을 가져옴
  const timestamp = admin.firestore.Timestamp.fromDate(regDate);
  
  db.collection('guideCard').add({
    'kind': 0,
    'writeDate': timestamp,
    'title': title,
    'content': content,
  }).then(async (docRef) => {
    db.collection('guideCard').doc(docRef.id).update({'uid': docRef.id});
    res.redirect('/guide');
  }).catch((error) => {
    console.error('error adding notice: ', error);
    res.status(500).send('error');
  })
  
});

// 공지사항 삭제
app.get('/deleteNotice/:id', requireAuth,(req, res) => {
  const noticeId = req.params.id;
  db.collection('noticeCard').doc(noticeId).delete()
    .then(() => {
      res.redirect('/announcement');
    })
    .catch((error) => {
      console.error('Error deleting notice: ', error);
      res.status(500).send('Something went wrong');
    });
});

// 가이드 삭제
app.get('/deleteGuide/:id', requireAuth, (req, res) => {
  const noticeId = req.params.id;
  db.collection('guideCard').doc(noticeId).delete()
    .then(() => {
      res.redirect('/guide');
    })
    .catch((error) => {
      console.error('Error deleting notice: ', error);
      res.status(500).send('Something went wrong');
    });
});

// methods
// total users size
async function getTotalUsers() {
  const snapshot = await db.collection('users').get();
  return snapshot.size;
}

function getTodayDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);  
  return today;
}

function getMonthDate() {
  const month = new Date();
  month.setDate(1);
  month.setHours(0, 0, 0, 0);
  return month;
}

async function getUsersSignUpToday() {
  const today = getTodayDate();
    
  const snapshot = await db.collection('users').where('createDate', '>=', today).get();
  const users = [];
  snapshot.forEach(doc => {
    users.push(doc.data());
  });
  
  return users;
}

// utils
app.post('/api/pushData', (req, res) => {
  const {uids, tokens, text} = req.body;
  // const tokens = uids.uids;
  console.log(uids, tokens, text);
  
  let num = 0;
  
  tokens.forEach((token) => {
    if(token) {
      let message = {
        notification: {
            title: '썸푸닝 알림',
            body: text
        },
        token: token,
        android: {
            priority: "high"
        },
        apns: {
            payload: {
                aps: {
                    contentAvailable: true,
                }
            }
        }
      }
      
      console.log(uids[num]);
  
      admin.messaging().send(message).then(function (response) {
          console.log('success : ', response);
          
          const regDate = new Date(); // 현재 날짜 및 시간을 가져옴
          const timestamp = admin.firestore.Timestamp.fromDate(regDate);
          
          db.collection('pushCard').add({
            'regDate': timestamp,
            'uid': uids[num],
            'content': text,
            'confirm': false
          }).then((docRef) => {
            console.log('알림이 성공적으로 저장되었습니다. 문서 ID : ', docRef.id);
            num ++;
          })
      }).catch(function(err) {
          console.log('fail : ', err);
      });
    }
    
  });

  res.json({"result" : "OK"});
});

//채팅경고
app.post('/api/updateWarning', async (req, res) => {
  const { docId, photoUrl, text, time, type, userID, username } = req.body;
  
  const regDate = new Date(); // 현재 날짜 및 시간을 가져옴
  const timestamp = admin.firestore.Timestamp.fromDate(regDate);
  
  const data = {
    isRead: false,
    photoUrl: "",
    text: text,
    time: timestamp,
    type: type,
    userID: userID,
    username: username
  }
  console.log(docId);
  await db.collection('chatRoom').doc(docId).collection('chats').add(data);
  res.json({'result': 'OK'});
})

//파티경고
app.post('/api/updatePartyWarning', async (req, res) => {
  const { docId, photoUrl, text, type, userID, username } = req.body;
  
  const regDate = new Date(); // 현재 날짜 및 시간을 가져옴
  const timestamp = admin.firestore.Timestamp.fromDate(regDate);
  
  const data = {
    photoUrl: photoUrl,
    text: text,
    time: timestamp,
    type: type,
    userID: userID,
    username: username
  }
  console.log(docId);
  await db.collection('partyCard').doc(docId).collection('chats').add(data);
  res.json({'result': 'OK'});
})

//파티삭제
app.post('/api/updatePartyDel', async (req, res) => {
  const { docId } = req.body;
  
  await db.collection('partyCard').doc(docId).update({'type': 1});
  res.json({'result': 'OK'});
})

//비디오그램 삭제
app.post('/api/updateVideoDel', async (req, res) => {
  const { docId } = req.body;
  
  console.log(docId);
  
  await db.collection('shortVideoCard').doc(docId).update({'type': 1});
  res.json({'result': 'OK'});
})

//그램 삭제
app.post('/api/updateGramDel', async (req, res) => {
  const { docId } = req.body;
  
  await db.collection('gramCard').doc(docId).update({'type': 1});
  res.json({'result': 'OK'});
})

//오디오 삭제
app.post('/api/updateAudioDel', async (req, res) => {
  const { docId } = req.body;
  
  await db.collection('shortVoiceCard').doc(docId).update({'type': 1});
  res.json({'result': 'OK'});
})

//기간별 매출 출력
app.post('/api/updateSales', async (req, res) => {
  const { start, end } = req.body;
  
  console.log(start, end);
})

//보석갯수 수정
app.post('/api/updateDia', async (req, res) => {
  const { uid, num } = req.body;
  await db.collection('users').doc(uid).update({'dia': parseInt(num)});
  res.json({'result': 'OK'});
})

//지역
app.post('/api/updateRegion', async (req, res) => {
  const { uid, region } = req.body;
  await db.collection('users').doc(uid).update({'region': pro_region.indexOf(region)});
  res.json({'result': 'OK'});
})

//학력
app.post('/api/updateEducation', async (req, res) => {
  const { uid, edu } = req.body;
  await db.collection('users').doc(uid).update({'education': pro_education.indexOf(edu)});
    res.json({'result': 'OK'});
})

//직업
app.post('/api/updateJob', async (req, res) => {
  const { uid, job } = req.body;
  await db.collection('users').doc(uid).update({'job': pro_job.indexOf(job)});
    res.json({'result': 'OK'});
})

//키
app.post('/api/updateHeight', async (req, res) => {
  const { uid, height } = req.body;
  await db.collection('users').doc(uid).update({'height': height});
    res.json({'result': 'OK'});
})

//체형
app.post('/api/updateBody', async (req, res) => {
  const { uid, body } = req.body;
  await db.collection('users').doc(uid).update({'body': pro_body.indexOf(body)});
    res.json({'result': 'OK'});
})

//MBTI
app.post('/api/updateMbti', async (req, res) => {
  const { uid, mbti } = req.body;
  await db.collection('users').doc(uid).update({'nbti': pro_mbti.indexOf(mbti)});
    res.json({'result': 'OK'});
})

//흡연
app.post('/api/updateSmoke', async (req, res) => {
  const { uid, smoke } = req.body;
  await db.collection('users').doc(uid).update({'smoke': pro_smoke.indexOf(smoke)});
    res.json({'result': 'OK'});
})

//흡연
app.post('/api/updateDrink', async (req, res) => {
  const { uid, drink } = req.body;
  await db.collection('users').doc(uid).update({'drinking': pro_drinking.indexOf(drink)});
    res.json({'result': 'OK'});
})

//고급차량
app.post('/api/updateAbility1', async (req, res) => {
  const { uid, ability1 } = req.body;
  await db.collection('users').doc(uid).update({'ability_0': pro_ability.indexOf(ability1)});
    res.json({'result': 'OK'});
})

//슈퍼카
app.post('/api/updateAbility2', async (req, res) => {
  const { uid, ability2 } = req.body;
  await db.collection('users').doc(uid).update({'ability_1': pro_ability.indexOf(ability2)});
    res.json({'result': 'OK'});
})

//명문대
app.post('/api/updateAbility3', async (req, res) => {
  const { uid, ability3 } = req.body;
  await db.collection('users').doc(uid).update({'ability_2': pro_ability.indexOf(ability3)});
    res.json({'result': 'OK'});
})

//전문직
app.post('/api/updateAbility4', async (req, res) => {
  const { uid, ability4 } = req.body;
  await db.collection('users').doc(uid).update({'ability_3': pro_ability.indexOf(ability4)});
    res.json({'result': 'OK'});
})

//사업가(연매출 10억)
app.post('/api/updateAbility5', async (req, res) => {
  const { uid, ability5 } = req.body;
  await db.collection('users').doc(uid).update({'ability_4': pro_ability.indexOf(ability5)});
    res.json({'result': 'OK'});
})

//사업가(연매출 20억)
app.post('/api/updateAbility6', async (req, res) => {
  const { uid, ability6 } = req.body;
  await db.collection('users').doc(uid).update({'ability_5': pro_ability.indexOf(ability6)});
    res.json({'result': 'OK'});
})

//사업가(연매출 30억)
app.post('/api/updateAbility7', async (req, res) => {
  const { uid, ability7 } = req.body;
  await db.collection('users').doc(uid).update({'ability_6': pro_ability.indexOf(ability7)});
    res.json({'result': 'OK'});
})

//명문대
app.post('/api/updateAbility8', async (req, res) => {
  const { uid, ability8 } = req.body;
  await db.collection('users').doc(uid).update({'ability_7': pro_ability.indexOf(ability8)});
    res.json({'result': 'OK'});
})

//고액소득(7천만원이상)
app.post('/api/updateAbility9', async (req, res) => {
  const { uid, ability9 } = req.body;
  await db.collection('users').doc(uid).update({'ability_8': pro_ability.indexOf(ability9)});
    res.json({'result': 'OK'});
})

//억대소득(1억이상)
app.post('/api/updateAbility10', async (req, res) => {
  const { uid, ability10 } = req.body;
  await db.collection('users').doc(uid).update({'ability_9': pro_ability.indexOf(ability10)});
    res.json({'result': 'OK'});
})

//고액자산(5억이상)
app.post('/api/updateAbility11', async (req, res) => {
  const { uid, ability11 } = req.body;
  await db.collection('users').doc(uid).update({'ability_10': pro_ability.indexOf(ability11)});
    res.json({'result': 'OK'});
})

//고액자산(10억이상)
app.post('/api/updateAbility12', async (req, res) => {
  const { uid, ability12 } = req.body;
  await db.collection('users').doc(uid).update({'ability_11': pro_ability.indexOf(ability12)});
    res.json({'result': 'OK'});
})

//초고액자산(20억이상)
app.post('/api/updateAbility13', async (req, res) => {
  const { uid, ability13 } = req.body;
  await db.collection('users').doc(uid).update({'ability_12': pro_ability.indexOf(ability13)});
    res.json({'result': 'OK'});
})

//고가아파트(10억이상)
app.post('/api/updateAbility14', async (req, res) => {
  const { uid, ability14 } = req.body;
  await db.collection('users').doc(uid).update({'ability_13': pro_ability.indexOf(ability14)});
    res.json({'result': 'OK'});
})

//초고가아파트(20억이상)
app.post('/api/updateAbility15', async (req, res) => {
  const { uid, ability15 } = req.body;
  await db.collection('users').doc(uid).update({'ability_14': pro_ability.indexOf(ability15)});
    res.json({'result': 'OK'});
})

//집안자산(30억이상)
app.post('/api/updateAbility16', async (req, res) => {
  const { uid, ability16 } = req.body;
  await db.collection('users').doc(uid).update({'ability_15': pro_ability.indexOf(ability16)});
    res.json({'result': 'OK'});
})

//집안자산(50억이상)
app.post('/api/updateAbility17', async (req, res) => {
  const { uid, ability17 } = req.body;
  await db.collection('users').doc(uid).update({'ability_16': pro_ability.indexOf(ability17)});
    res.json({'result': 'OK'});
})

//명문가
app.post('/api/updateAbility18', async (req, res) => {
  const { uid, ability18 } = req.body;
  await db.collection('users').doc(uid).update({'ability_17': pro_ability.indexOf(ability18)});
  res.json({'result': 'OK'});
})

//보류 발송
app.post('/api/updateCompanion', async (req, res) => {
  const { uid, token, companion } = req.body;
  
  console.log(uid, token, companion);
  
  await db.collection('users').doc(uid).update({ 'judge': 2 });
  
  if(token) {
    let message = {
      notification: {
          title: '썸푸닝 프로필 심사',
          body: companion
      },
      token: token,
      android: {
          priority: "high"
      },
      apns: {
          payload: {
              aps: {
                  contentAvailable: true,
              }
          }
      }
    }
    
    console.log(uid);

    admin.messaging().send(message).then(function (response) {
        console.log('success : ', response);
    }).catch(function(err) {
        console.log('fail : ', err);
    });
  }
  res.json({"result" : "OK"});
});

//반려사유 발송
app.post('/api/updateReturn', async (req, res) => {
  const { uid, token, reason} = req.body;
  
  console.log(uid, token, reason);
  
  await db.collection('users').doc(uid).update({ 'judge': 2 });
  
  if(token) {
    let message = {
      notification: {
          title: '썸푸닝 프로필 심사',
          body: reason
      },
      token: token,
      android: {
          priority: "high"
      },
      apns: {
          payload: {
              aps: {
                  contentAvailable: true,
              }
          }
      }
    }
    
    console.log(uid);

    admin.messaging().send(message).then(function (response) {
        console.log('success : ', response);
    }).catch(function(err) {
        console.log('fail : ', err);
    });
  }
  res.json({"result" : "OK"});
});

//승인 발송
app.post('/api/updateOk', async (req, res) => {
  const { uid, token, reason} = req.body;
  
  console.log(uid, token, reason);
  
  await db.collection('users').doc(uid).update({ 'judge': 3 });
  
  if(token) {
    let message = {
      notification: {
          title: '썸푸닝 프로필 심사',
          body: reason
      },
      token: token,
      android: {
          priority: "high"
      },
      apns: {
          payload: {
              aps: {
                  contentAvailable: true,
              }
          }
      }
    }
    
    console.log(uid);

    admin.messaging().send(message).then(function (response) {
        console.log('success : ', response);
    }).catch(function(err) {
        console.log('fail : ', err);
    });
  }
  res.json({"result" : "OK"});
});

app.use(authRoutes);