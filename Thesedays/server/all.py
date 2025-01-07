from bs4 import BeautifulSoup
import requests
import re
from tqdm import tqdm
from config import OPENAI_API_KEY
from openai.error import InvalidRequestError
import openai
import json
import requests



import tiktoken
enc = tiktoken.encoding_for_model("gpt-3.5-turbo")



# 페이지 url 형식에 맞게 바꾸어 주는 함수 만들기
  #입력된 수를 1, 11, 21, 31 ...만들어 주는 함수
def makePgNum(num):
    if num == 1:
        return num
    elif num == 0:
        return num+1
    else:
        return num+9*(num-1)

# 크롤링할 url 생성하는 함수 만들기(검색어, 크롤링 시작 페이지, 크롤링 종료 페이지)

def makeUrl(search, start_pg, end_pg):
    if start_pg == end_pg:
        start_page = makePgNum(start_pg)
        url = "https://search.naver.com/search.naver?where=news&sm=tab_pge&query=" + search + "&start=" + str(start_page)
        # print("생성url: ", url)
        return url
    else:
        urls = []
        for i in range(start_pg, end_pg + 1):
            page = makePgNum(i)
            url = "https://search.naver.com/search.naver?where=news&sm=tab_pge&query=" + search + "&start=" + str(page)
            urls.append(url)
        # print("생성url: ", urls)
        return urls    

# html에서 원하는 속성 추출하는 함수 만들기 (기사, 추출하려는 속성값)
def news_attrs_crawler(articles,attrs):
    attrs_content=[]
    for i in articles:
        attrs_content.append(i.attrs[attrs])
    return attrs_content

# ConnectionError방지
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}

#html생성해서 기사크롤링하는 함수 만들기(url): 링크를 반환
def articles_crawler(url):
    #html 불러오기
    original_html = requests.get(i,headers=headers)
    html = BeautifulSoup(original_html.text, "html.parser")

    url_naver = html.select("div.group_news > ul.list_news > li div.news_area > div.news_info > div.info_group > a.info")
    url = news_attrs_crawler(url_naver,'href')
    return url


#####뉴스크롤링 시작##### 
search = "경제"
page = 1
page2 = 2
# '경제' 키워드로 1페이지부터 2페이지까지 크롤링


# naver url 생성
url = makeUrl(search,page,page2)

#뉴스 크롤러 실행
news_titles = []    # 제목
news_url =[]        # 링크
news_contents =[]   # 내용
news_dates = []     # 날짜
for i in url:
    url = articles_crawler(url)
    news_url.append(url)


#제목, 링크, 내용 1차원 리스트로 꺼내는 함수 생성
def makeList(newlist, content):
    for i in content:
        for j in i:
            newlist.append(j)
    return newlist

    
#제목, 링크, 내용 담을 리스트 생성
news_url_1 = []

#1차원 리스트로 만들기(내용 제외)
makeList(news_url_1,news_url)

#NAVER 뉴스만 남기기
final_urls = []
for i in tqdm(range(len(news_url_1))):
    if "news.naver.com" in news_url_1[i]:
        final_urls.append(news_url_1[i])
    else:
        pass
    
# Create a list to store news summaries and URLs
news_summaries = []
news_urls = []


# 뉴스 내용 크롤링
for i in tqdm(final_urls):
    #각 기사 html get하기
    news = requests.get(i,headers=headers)
    news_html = BeautifulSoup(news.text,"html.parser")

    # 뉴스 제목 가져오기
    title = news_html.select_one("#ct > div.media_end_head.go_trans > div.media_end_head_title > h2")
    if title == None:
        title = news_html.select_one("#content > div.end_ct > div > h2")
    
    # 뉴스 본문 가져오기
    content = news_html.select("div#dic_area")
    if content == []:
        content = news_html.select("#articeBody")

    # 기사 텍스트만 가져오기
    # list합치기
    content = ''.join(str(content))
    
    # 기사 URL 가져오기
    news_url = i
    
    # html태그제거 및 텍스트 다듬기
    pattern1 = '<[^>]*>'
    title = re.sub(pattern=pattern1, repl='', string=str(title))
    content = re.sub(pattern=pattern1, repl='', string=content)
    pattern2 = """[\n\n\n\n\n// flash 오류를 우회하기 위한 함수 추가\nfunction _flash_removeCallback() {}"""
    content = content.replace(pattern2, '')

    #copied news
    copied_content = content

    #tokenize the content
    #token is smaller than 150 it was photo news

    tokens = len(enc.encode(copied_content))

    if tokens > 3800 or tokens < 300:
        continue

    print("tokens: ", tokens)
 
    news_titles.append(title)
    news_contents.append(content)

    try:
        html_date = news_html.select_one("div#ct> div.media_end_head.go_trans > div.media_end_head_info.nv_notrans > div.media_end_head_info_datestamp > div > span")
        news_date = html_date.attrs['data-date-time']
    except AttributeError:
        news_date = news_html.select_one("#content > div.end_ct > div > div.article_info > span > em")
        news_date = re.sub(pattern=pattern1,repl='',string=str(news_date))
    # 날짜 가져오기
    news_dates.append(news_date)

print("\n검색된 기사 갯수: 총 ",(page2+1-page)*10,'개')
print("\n[뉴스 제목]")
print(len(news_titles))

news_summary = []

# 기사 내용을 요약하는 함수
def summarize_article(news_content, api_key):
    openai.api_key = api_key  # OpenAI API 키를 입력하세요.
    
    try:
        # Chat Completion API 요청
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "넌 뉴스를 요약해주는 인공지능이야. 내가 주는 뉴스를 한국어로 120token 이내로 요약해줘. 그리고 문장을 마무리 할때는 꼭 동사로 -이다로 끝내줘."},
                {"role": "user", "content": news_content}
            ],
        )
        
        
        # 요약 결과 추출
        summary = response['choices'][0]['message']['content']
        return summary
    except InvalidRequestError as e:
        print(e)
        return None


for news_content in news_contents: #
    if news_contents.index(news_content) > 3: #
        break #
    
    summary = summarize_article(news_content, OPENAI_API_KEY)
    print(news_contents.index(news_content))
    
    print(summary)
    print("\n")
    if summary is not None:
        news_summary.append(summary)
        news_urls.append(news_url)
        
# Create a dictionary to store the summaries and URLs
news_data = {
    "summaries": news_summary,
    "urls": news_urls
}

# Convert the dictionary to JSON format
news_data_json = json.dumps(news_data, ensure_ascii=False)

# Print the JSON string
print(news_data_json)
        
        
        