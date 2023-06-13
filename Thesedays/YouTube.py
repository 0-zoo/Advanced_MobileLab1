import re
from collections import defaultdict
import requests
from bs4 import BeautifulSoup

url = "https://www.youtube.com/feed/trending"
res = requests.get(url)
res.raise_for_status()
soup = BeautifulSoup(res.text, "html.parser")

videos = soup.find('html').find('body', attrs={'dir': 'ltr'})

data_rows = videos.find_all("script")
string = data_rows[13].string

video_start_index = string.find('"title":{"runs":[{"text":"')  # Find the index of the start of the first video
video_count = 1
videos = []
publishers_total_view_count = defaultdict(int)
publishers_single_view_count = defaultdict(list)

while video_start_index != -1:  # Continue parsing until there are no more videos
    # Extracting title
    title_match = re.search(r'"title":{"runs":\[{"text":"(.*?)"', string[video_start_index:])
    title = title_match.group(1) if title_match else None

    # Extracting publisher
    publisher_match = re.search(r'"longBylineText":{"runs":\[\{"text":"(.*?)"', string[video_start_index:])
    publisher = publisher_match.group(1) if publisher_match else None

    # Extracting view count
    view_count_match = re.search(r'"viewCountText":{"simpleText":"(.*?)"', string[video_start_index:])
    view_count_text = view_count_match.group(1) if view_count_match else None

    if None not in (title, publisher, view_count_text) and title != '인기 급상승 Shorts':
        # Extracting the actual view count from the view count text
        view_count = int(re.sub(r'\D', '', view_count_text))

        videos.append((video_count, title, publisher, view_count_text))
        publishers_total_view_count[publisher] += view_count
        publishers_single_view_count[publisher].append(view_count)

        video_count += 1

    video_start_index = string.find('"title":{"runs":[{"text":"', video_start_index + 1)

# Printing all video information
for video_info in videos:
    video_count, title, publisher, view_count_text = video_info
    print(f"Video {video_count}")
    print("Title:", title)
    print("Publisher:", publisher)
    print("View Count:", view_count_text)
    print("---------------------")

# Sorting publishers by total view count in descending order
sorted_publishers_total_view = sorted(publishers_total_view_count.items(), key=lambda x: x[1], reverse=True)

# Printing the top 10 steady hot YouTubers by total view count
print("Steady Hot YouTuber 10:")
for rank, (publisher, total_view_count) in enumerate(sorted_publishers_total_view[:10], start=1):
    print(f"Rank {rank}: {publisher} (Total View Count: {total_view_count})")

# Sorting publishers by single video view count in descending order
sorted_publishers_single_view = sorted(publishers_single_view_count.items(), key=lambda x: max(x[1]), reverse=True)

print("---------------------")
# Printing the top 10 lately hot YouTubers by single video view count
print("Lately Hot YouTuber 10:")
for rank, (publisher, view_count_list) in enumerate(sorted_publishers_single_view[:10], start=1):
    total_view_count = max(view_count_list)
    print(f"Rank {rank}: {publisher} (View Count: {total_view_count})")

