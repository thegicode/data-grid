# data-grid

## Server

cd /Users/deokim/Documents/코딩/project-my/data-grid

npx http-server

http://127.0.0.1:8080
http://172.29.113.96:8080

http://127.0.0.1:8080/v2/data-grid.html

http://127.0.0.1:8080/v3/index.html

-   캐시 삭제 하면서 작업해야 함 : cmd + shift +r

<br>

## 작업 체크리스트

### v4

    - td : custom element

### v3

    - [x] sort
    - [x] select row
    - [x] show(save) current data
    - [x] td : text

### 셀 이동

    -   [x] tab, shift+tab 이동
    -   [x] shift+enter 로 위 row 로 이동
    -   [x] enter 로 수정하면 다음 row 는 focus 인 상태로 값을 바로 입력할 수 있다.
    -   [x] 셀 이동시 페이지 아웃하면 스크롤 자동 이동

### input

    -   [x] enter로 편집 모드 시작
    -   [x] 포커스 된 상태에서 입력하다가 esc 누르면 value 취소

### checkbox

    -   [x] 스페이스 : 선택 + 포커스
    -   [x] checkbox의 경우 포커스 유무와 상관없이 상하좌우 방향키가 가능

### select

    -   [x] 스페이스 :  포커스
    -   [x] 선택하면 바로 다음 셀렉트 띄우기

### 영역 지정 + 복사 + 붙여넣기

    -   [x] 선택 영역 csv 파일로 저장하기
    -   [x] 붙여넣기할때 포맷이 다르면 무시
    -   [x] 영역 선택시 사각형으로 선택하기
    -   [ ] ctrl + z 로 복귀 (우선순위낮음)

### 스크롤

    -   [x] 좌측 컬럼 고정 + 나머지 하단 스크롤
    -   [ ] 가로 스크롤 이동을 일반 방향키만으로 하지않고, cmd+방향키로

### 컬럼 이동

    -   [x] 한번 클릭하면 전체 선택
    -   [x] 클릭한 상태에서 드래그앤 드롭 가능
    -   [ ] ctrl + z 로 복귀 (우선순위낮음)

### th 로 정렬

### 객체 배열로 렌더링하기

### 수정한 거 객체 배열에 저장하기

### 컬럼 입력 엘리먼트들

    -   [x] input-string 입력
    -   [x] input-number 입력
    -   [x] input-datalist string
    -   [x] select
    -   [x] checkbox boolean
    -   [ ] input datetime

### 검색, 필터

    -   [ ] 테이블에 포커스된 상태에서 cmd+f 로 검색하면 해당하는 텍스트를 활성화한다

### 데이타 구조 샘플

    -   uuid
    -   product name
    -   price
    -   전단행사 여부
    -   적립 금액

### 페이징

### 반응형
