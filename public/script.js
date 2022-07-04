const tasksDOM = document.querySelector('.tasks');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert')

// /api/v1/tasksからタスクを読み込む
const showTasks = async () => {
    try {
        //自作APIを叩く
        // const tasks = await axios.get("/api/v1/tasks"); このままだと余計な情報が多い
        const {data:tasks} = await axios.get("/api/v1/tasks"); //必要なデータのみ取得
        // console.log(tasks);

        //タスクのデータが0であればメッセージを表示->処理を終了させる
        if (tasks.length < 1) {
            tasksDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5>`;
            return;
        }
        
        //タスクを出力
        const allTasks = tasks.map((task) => {
            // console.log(task);
            const { completed, _id, name } = task; //分割代入 ${completed && "task-completed"}->completedがtrueならtask-completedのclassを付加する
            return `
                <div class="single-task ${completed && "task-completed"}">  
                <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
                <div class="task-links">
                    <!-- 編集リンク -->
                    <a href="edit.html?id=${_id}" class="edit-link"><i class="fas fa-edit"></i></a>
                    <!-- ゴミ箱リンク -->
                    <button type="button" class="delete-btn" data-id="${_id}" ><i class="fas fa-trash"></i></button>
                </div>
            </div>
            `;
        }).join('');  //joinで配列を連結して一つの文字列にする

        // console.log(allTasks);
        tasksDOM.innerHTML = allTasks;

    } catch(err) {
        console.log(err);
    }
}

showTasks();




//タスクを新規作成する
formDOM.addEventListener('submit', async (e) => {
    e.preventDefault(); //リロードを防止する
    const name = taskInputDOM.value; //inputのvalueを取得
    
    try {
        await axios.post('/api/v1/tasks', { name: name });
        showTasks(); //再読み込み
        taskInputDOM.value = ""; //inputを空に
        formAlertDOM.style.display = 'block'; //formAlertDOM blockを追加
        formAlertDOM.textContent = 'タスクを追加しました'; 
        formAlertDOM.classList.add('text-success'); //文字を緑色で表示
    } catch (err) {
        console.log(err);   
        formAlertDOM.style.display = 'block';
        formAlertDOM.innerHTML = '無効です。もう一度やり直してください。';
    }
    setTimeout(() => {
        formAlertDOM.style.display = 'none'; //表示を消す
        formAlertDOM.classList.remove('text-success');  //つけてないと緑が残り続ける
    }, 3000);
});


//タスクを削除する
tasksDOM.addEventListener('click', async (e) => {
    const element = e.target;
    // console.log(element); //クリックした要素を取得
    // console.log(element.parentElement); //クリックした親要素を取得
    if (element.parentElement.classList.contains('delete-btn')) { //取得した要素のクラスにdelete-btnがあれば
        const id = element.parentElement.dataset.id; 
        // console.log(id);
        try {
            await axios.delete(`/api/v1/tasks/${id}`);
            showTasks(); //削除を実行したあとにもう一度データベースを読み込む
        } catch (err) {
            console.log(err);
        }
    }
});