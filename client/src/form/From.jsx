// https://www.tonyvu.co/posts/react-hook-form-tailwind-css
import React, {useState} from "react";
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import httpClient from "../api/http-common";
import Select from 'react-select'

import i18next, { use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
  detection:{
    // order and from where user language should be detected
    order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  
    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
  
    // cache user language on
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)
  
    // optional expire and domain for set cookie
    cookieMinutes: 10,
    cookieDomain: 'myDomain',
  
    // optional htmlTag with lang attribute, the default is:
    htmlTag: document.documentElement,
  
    // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
    cookieOptions: { path: '/', sameSite: 'strict' }
  },
});



const From = (props) => {

  // 如果需要自己判断的话，原来的逻辑
  const options = [ 
    { value: 'zh-CN', label: 'zh-CN' },
    { value: 'en-US', label: 'en-US' },
  ]

  const [language, setLanguage] = useState("zh-CN");
  // const [language, setLanguage] = useState("en-US")

  const [selectDefault, setSelectDefault] = useState();
  useEffect(()=>{
    setLanguage(i18next.language)
  },[i18next.language]);

  // console.log(selectDefault)
  useEffect(()=>{
    const dv = options.filter( item =>{ return item.label === language })
    if (dv?.length > 0){
      setSelectDefault(dv)
    }
    setSelectDefault({ value: 'zh-CN', label: 'zh-CN' })
  },[language])

  const [postResult, setPostResult] = useState({'status':null, 'res':null});
  const { register, errors, handleSubmit } = useForm();
  const [data, setData] = useState();


  /* 
  console.log(props?.location?.state?.lang)
  const [language, setLanguage] = useState()
  useEffect(()=>{
    setLanguage(props.location.state.lang)
  },[props.location.state.lang]);
    */

  const onSubmit = async (data) => {    
    setData(data);
    console.log('setData',data)
  };

  useEffect(()=>{
    if(data) { 
      const token = localStorage.getItem("submittedFlag");
      if(token){
        alert("您已提交过 ~ ")
      }
      else{
        localStorage.setItem("submittedFlag", 'submitted');
        console.log('Post —— postForm ', data)
        postForm();
        alert("提交成功 ~ ")
      }      
    }
  },[data]);

  const { isLoading: isPostingTutorial, mutate: postForm } = useMutation(
    async () => {
      return await httpClient.post(`/form`, data    
    )},
    {
      onSuccess: (res) => { setPostResult({status: 'success',res: res}) },
      onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},
    }
  );
  
  const applyFunc = (func, e) => {
    try { 
      alert('报名成功！')
      func(); 
    } 
    catch (err) { console.log('err', err) }
  }


  const languageHandler = (v, e) => {
     console.log('e.target.value', e,v)
     setLanguage(v.value)
  }
  console.log('i18next :', i18next.language)
  return (
    <>
      {selectDefault && 
      <div className="flex justify-items-end justify-end pr-2 pt-2">
        <p className='pt-2 pr-1'>language: </p>
        <Select options={options} 
          defaultValue={selectDefault}
          onChange={e => languageHandler(e)}
        />
      </div>
      }

    {/* 中文页面 */}
    { (language === 'zh-CN') ? (

      // <h1 className='text-center text-4xl font-semibold mt-10'>Post a job</h1> 
      <>
      <h1 className="pt-20 text-center text-3xl font-medium">2022 国际化学合成生物学</h1>
      <h1 className="text-center text-2xl font-medium">前沿科技论坛（杭州）</h1>
      
    <form
        className='max-w-xl m-auto py-10 mt-10 px-12 border text-gray-700'
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="mb-3 text-gray-500">报名表单填写：</p>
        <label className='text-gray-700 font-medium'>*姓名、称呼：</label>

        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4 w-full rounded text-gray-700'
          name=''
          placeholder=''
          autoFocus
          {...register("name", {'required': "Please enter a your name.",})}
        />
        {errors?.name && (
          <div className='mb-3 text-normal text-red-500'>
            {errors?.name.message}
          </div>
        )}

        {/* Radios 单选 - 机构类型  */}
        <label className='text-gray-700 font-medium block mt-4'>机构类型：</label>
        <div> 
          <label className='ml-4 inline-block'>
            <input className='mt-4 mr-1'
                value='高校、研究机构'
                type='radio'
                {...register("institution")}
              />高校、研究机构
        </label></div>

        <div>
          <label className='ml-4 inline-block'>
            <input className='mt-4 mr-1' type='radio' value='企业' {...register("institution")} />
            企业
          </label>
        </div>

        <div>
          <label className='ml-4 inline-block'>
            <input className='mt-4 mr-1' type='radio' value='投资机构' {...register("institution")} />
              投资机构
          </label>
        </div>
        {errors?.institution && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.institution.message}
          </div>
        )}


        {/* Radios 单选 - 就职单位名称： */}
        <label className='text-gray-700 font-medium block mt-4'>就职单位名称：</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='text'
          placeholder=''
          {...register("employedInstitution")}
        />
        {errors?.employedInstitution && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.employedInstitution.message}
          </div>
        )}

      <label className='text-gray-700 font-medium block mt-4'>职务：</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='text'
          placeholder=''
          {...register("position")}
        />
        {errors?.position && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.position.message}
          </div>
        )}

      <label className='text-gray-700 font-medium block mt-4'>*邮箱：</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='email'
          placeholder='请填写 Email...'
          {...register("email", { required: "Please enter your email",})}
        />
        {errors?.email && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.email.message}
          </div>
        )}


      <label className='text-gray-700 font-medium block mt-4'>*手机号：</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='tel'
          placeholder='请填写手机号...'
          {...register("tel", {required: true, minLength: 11, maxLength: 11})}
        />
        {errors?.tel && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.tel.message}
          </div>
        )}

        {/*  Radios 单选 - 参与形式  */}
        <label className='text-gray-700 font-medium block mt-4'>参会形式：</label>
        <div> <label className='ml-4 inline-block'>
        <input
            className='mt-4 mr-1'
            value='线上'
            type='radio'
            {...register("participation")}
          />
          线上
        </label></div>

        <div><label className='ml-4 inline-block'>
          <input className='mt-4 mr-1' type='radio' value='线下' {...register("participation")} />
          线下
        </label></div>
        {errors?.participation && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.participation.message}
          </div>
        )}
      




        <label className='text-gray-700 font-medium block mt-4'>随行人数：</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='number'
          {...register("num")}
        />
        {errors?.num && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.num.message}
          </div>
        )}

        <label className='text-gray-700 font-medium block mt-4'>是否需要预定会议酒店（520￥/间）</label>
        <p className='itelic font-thin text-gray-500 text-xs'>* 注：大会报告特邀嘉宾免房费，协办企业 2 人以内免房费</p>
        <label className='ml-4 inline-block'>
        <input
            className='mt-4 mr-1'
            value='是'
            type='radio'
            {...register("isNeedHotel")}
          />是
        </label>

        <label className='ml-4 inline-block'>
          <input className='mt-4 mr-1' type='radio' value='否' {...register("isNeedHotel")} />
          否
        </label>
        {errors?.isNeedHotel && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.isNeedHotel.message}
          </div>
        )}

        <label className='text-gray-700 font-medium block mt-4'>房间数量：</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='number'
          {...register("roomNum")}
        />
        {errors?.roomNum && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.roomNum.message}
          </div>
        )}

        <label className='text-gray-700 font-medium block mt-4'>入住日期</label>
          <input
            type='checkbox'
            value='11月06日'
            placeholder='11月06日'
            {...register('checkInDate')}
            className='mx-3'
          />
        <label htmlFor=''>11月06日</label>

          <input
            type='checkbox'
            value='11月7日'
            placeholder='11月7日'
            {...register('checkInDate')}
            className='mx-3'
          />
          <label htmlFor=''>11月7日</label>

        <button
          className='mt-4 w-full rounded-md bg-black px-20  py-2 text-white border font-semibold text-md'
          type='submit'
        > 提交
        </button>

      {/* 
      随行人数 
        是否需要预定会议酒店 （520￥/间）
        
        房间数量
        入住天数（勾选日期） 
          
          11月07日
      */}

      
      </form>
      </>
    )

    


    :
    
    (
      <>
      <h1 className="pt-20 text-center text-3xl font-medium">International Forum on Chemical Synthetic Biology (Hangzhou)</h1>
      
    <form
        className='max-w-xl m-auto py-10 mt-10 px-12 border'
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="mb-3 text-gray-500">Please fill out the registration form:</p>
        <label className='text-gray-700 font-medium'>* Name:</label>

        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4 w-full rounded text-gray-700'
          name=''
          placeholder=''
          autoFocus
          {...register("name", {'required': "Please enter a your name.",})}
        />
        {errors?.name && (
          <div className='mb-3 text-normal text-red-500'>
            {errors?.name.message}
          </div>
        )}

        {/* Radios 单选 - 机构类型  */}
        <label className='text-gray-700 font-medium block mt-4'>Type of your employer:</label>
        <div> 
          <label className='ml-4 inline-block'>
            <input className='mt-4 mr-1'
                value='高校、研究机构'
                type='radio'
                {...register("institution")}
              />University/Research Institution
        </label></div>

        <div>
          <label className='ml-4 inline-block'>
            <input className='mt-4 mr-1' type='radio' value='企业' {...register("institution")} />
            Industry
          </label>
        </div>

        <div>
          <label className='ml-4 inline-block'>
            <input className='mt-4 mr-1' type='radio' value='投资机构' {...register("institution")} />
              Investment Institution
          </label>
        </div>
        {errors?.institution && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.institution.message}
          </div>
        )}


        {/* Radios 单选 - 就职单位名称： */}
        <label className='text-gray-700 font-medium block mt-4'>Employer:</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='text'
          placeholder=''
          {...register("employedInstitution")}
        />
        {errors?.employedInstitution && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.employedInstitution.message}
          </div>
        )}

      <label className='text-gray-700 font-medium block mt-4'>Title:</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='text'
          placeholder=''
          {...register("position")}
        />
        {errors?.position && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.position.message}
          </div>
        )}

      <label className='text-gray-700 font-medium block mt-4'>* Contact: email:</label>
        <input
          className='border-solid border-gray-300 border py-1 mt-1 px-4  w-full rounded text-gray-700'
          type='text'
          {...register("email", { required: "Please enter your email",})}
        />
        {errors?.email && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.email.message}
          </div>
        )}

        {/*  Radios 单选 - 参与形式  */}
        <label className='text-gray-700 font-medium block mt-4'>Form of Participation:</label>
        <div> <label className='ml-4 inline-block'>
        <input
            className='mt-4 mr-1'
            value='线上'
            type='radio'
            {...register("participation")}
          />
          online
        </label></div>

        <div><label className='ml-4 inline-block'>
          <input className='mt-4 mr-1' type='radio' value='线下' {...register("participation")} />
          offline
        </label></div>
        {errors?.participation && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.participation.message}
          </div>
        )}

      <button
          className='mt-4 w-full rounded-md bg-black px-20  py-2 text-white border font-semibold text-md'
          type='submit'
        > Registration
        </button>
      </form>
      </>
    )}


        {/* <label className='text-gray-700 font-medium block mt-4'>
          Description
        </label>
        <textarea
          className='border-solid border-gray-300 border py-20 px-4 w-full rounded text-gray-700'
          rows={5}
          cols={5}
          {...register("description",{
            required: "Please enter a job description",
          })}
        />
        {errors?.description && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.description.message}
          </div>
        )} */}

        {/* <label className='text-gray-700 font-medium block mt-4'>
          Link to apply for this job
        </label>
        <input
          className='border-solid border-gray-300 border py-2 px-4 w-full rounded text-gray-700'
          type='text'
          placeholder='https://www.customerengjobs.com'
          {...register("link", {
            required: "Please enter a link",
          })}
        />
        {errors?.link && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.link?.message}
          </div>
        )}

        <label className='text-gray-700 font-medium block mt-4'> Email </label>
        <input className='border-solid border-gray-300 border py-2 px-4 w-full rounded text-gray-700' 
          type="email" 
          {...register("email", {
            required: "Please enter a link",
          })}
        />
        {errors?.email && (
          <div className='mb-3 text-normal text-red-500 '>
            {errors?.email?.message}
          </div>
        )} */}

      {/* <Modal showModal={showModal} /> */}
    </>
  );
};

export default From;
