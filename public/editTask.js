const taskIdDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const editFormDOM = document.querySelector('.single-task-form');
const formAlertDOM = document.querySelector('.form-alert');
const taskCompletedDOM = document.querySelector('.task-edit-completed');

const params = window.location.search; //get query params
const id = new URLSearchParams(params).get('id');

console.log(id);

//１つの特定のタスクを取得する
const showTask = async () => {
    try {
        const { data:task } = await axios.get(`/api/v1/tasks/${id}`);
        // console.log(task);
        const { _id, completed, name } = task;
        taskIdDOM.textContent = _id;
        taskNameDOM.value = name;
        
        if (completed) {
            taskCompletedDOM.checked = true;  //checkedでinput要素のチェック状態を取得(true or false)
        }

    } catch (err) {
        console.log(err);
    }
}

showTask();


//タスクの編集
editFormDOM.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const taskName = taskNameDOM.value;
        taskCompleted = taskCompletedDOM.checked;  //input要素のchecked状態をture or falseで取得できる
        const { data: task } = await axios.patch(`/api/v1/tasks/${id}`, {
            name: taskName,
            completed:taskCompleted,
        });
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = '編集に成功しました';
        formAlertDOM.classList.add('text-success');
    } catch (err) {
        console.log(err);
    }

    setTimeout(() => {
        formAlertDOM.style.display = 'none'; //表示を消す
        formAlertDOM.classList.remove('text-success');  //つけてないと緑が残り続ける
    }, 3000);
});