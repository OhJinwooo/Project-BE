const Post = require("../../schemas/post.schemas");
const Review = require('../../schemas/review.schemas');
const moment = require('moment')
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
const { v4 } = require('uuid');
const { create } = require("../../schemas/user.schemas");
const { object } = require("webidl-conversions");
const uuid = () => {
  const tokens = v4().split('-')
  return tokens[2] + tokens[1] + tokens[3] ;
}


//전체조회 페이지 (이달의 작가 추전 부분(임시적 구현 artPost 에 저장된user로 불러옴))
const getHome = async (req, res) => {
  try{
      //limt함수 사용 보여주는 데이터 숫자 제한
      const artPost = await Post.find({}).sort('-Likecount').limit(4);
      const artWriter = artPost.user;
      const reviwPage = await Review.find({}).sort('-Likecount').limit(4);
      res.status(200).json({
        respons:'success',
        msg:'조회 성공',
        data:{artPost,artWriter,reviwPage}
      })
  }catch(error){
    res.status(400).json({
      respons:"file",
      msg:'전체조회 실패'
    })
  }
};

//스토어 페이지(무한스크롤(임시적용 개선 방안 필요), 필터 기능 (개선 중(시간소요)) )
const artStore = async(req,res)=>{
  try{
    //페이지의 시작 값을 받음(테이터의 총개수)
    const data = req.body;
    //태그 기능 변수
    const category = data.category;
    const transaction = data.transaction;
    const changeAddress = data.changeAddress;
    //태그기능 변수 통합
    const artFilter = {category:category,
      transaction:transaction,
      changeAddress:changeAddress};
    //시작을 지정할 변수 선언
    let start = 0;
    //이미데이터가 넘어가서 있는지 확인
    if(data.start <= 0){
      start = 0 ;
    }else{
      start = data.start - 1
    };
    //마지막 값 지정
    let last = start + 5
    // 지정해서 보내주는 데이터
    if(data.start && !category && !transaction && !changeAddress)
    {
      const artPost = await Post.find({}).limit(start,last);
      res.status(200).json({
      respons:"success",
      msg:'스토어 조회 성공',
      artPost
    });
  }
    if(artFilter){
      console.log(object.key(artFilter).length)
      for(let i = 0 ; i<artFilter.length; i++){
        console.log(artFilter[i])
      if(artFilter[i] !== undefined){
        console.log(artFilter[i])
        const fin = cat.find(artFilter[i])
        console.log(fin)
      }
    }
    };
 
  }catch(error){
    res.status(400).json({
      respons:"file",
      msg:'전체조회 실패'
    });
  };
};

//작성 api(이미지 및 영상 첨부 기능 (부분적 구현 중))
const artPost = async (req, res) => {
 try{
   const image = req.files
   const imgurl = `${req.protocol}://${req.get('host')}/img/${image}`
   console.log(imgurl)
  /* //data라는 변수로 body를 받음
  const {} = req.body;
  const {} = res.locals ;
  //uuid를 사용하여 고유 값생성
  const postId = uuid();
  //moment를 이용하여 한국시간으로 날짜생성
  const createdAt = new moment().format('YYYY-MM-DD HH:mm:ss');
  //검증 고유값중복 검증
  const artPostId = await Post.find({postId}).exec();
  //조건 postId
  if(artPostId.postId !== postId){
    const artBrod = new Post({});
    await artBrod.save();
    res.status(200).json({
      respons:"success",
      msg:'판매글 생성 완료'
    });
  } */
  }catch(error){
    res.status(400).json({
      respons:"file",
      msg:'판매글 생성 실패'
    })
  }
};
module.exports = { getHome, artPost, artStore };