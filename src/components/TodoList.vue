<template>
  <div>
    <header>
      <img src="../assets/logo.png" />
      <div>TodoList</div>
      
    </header>

    <section class="add-section">
      <input
        type="text"
        class="input-box"
        v-model="todoDescription"
        @keyup.enter="addTodoItem"
        placeholder="添加待办事项"
      />

      <a @click="addTodoItem">✓</a>
    </section>

    <section>

      <!-- 已完成 -->
      <div v-if="open">
        <ul>
          <li v-for="(item, index) in todoList" :key="index" v-if="item.done">
            <div class="view-done">

              <input type="checkbox" @change="changeTodoItemStatus(index,false)" checked="checked" />
              <label @dblclick="getEdit(index)">{{item.todoDescription}}</label>
              <a @click="deleteTodoItem(index,false)" href="javascript:void(0)">✕</a>
              
              <input
                class="edit"
                v-todo-focus="item.editing"
                v-if="item.editing"
                :value="item.todoDescription"
                @blur="saveEdit(index, $event)"
                @keydown.enter="saveEdit(index, $event)"
              />

            </div>
          </li>
        </ul>
      </div>

      <!-- 未完成 -->
      <ul>
        <li v-for="(item, index) in todoList" :key="index" v-if="!item.done">
          <div class="view">

            <input type="checkbox" @change="changeTodoItemStatus(index,true)" />
            <label @dblclick="getEdit(index)">{{item.todoDescription}} </label>
            <a @click="deleteTodoItem(index,true)" href="javascript:void(0)">✕</a>
            
            <textarea
              class="edit"
              v-todo-focus="item.editing"
              v-if="item.editing"
              :value="item.todoDescription"
              @blur="saveEdit(index, $event)"
              @keydown.enter="saveEdit(index, $event)"
            />

          </div>
        </li>
      </ul>

      <!-- 统计 -->
      <ul>
        <li class="todo-result-li">
            <div class="todo-result">
              <span>未完成：{{todoLength}}/{{this.todoList.length}}</span>
            </div>
        </li>
      </ul>
    </section>

    <footer>
      <span class="switch">
        <input class="switch-box point" type="checkbox" checked="checked" v-model="open" />显示已完成
      </span>
      <a @click="clearData()" href="javascript:void(0)">清空</a>
    </footer>
  </div>
</template>

<script>
import * as Utils from "../utils";

export default {
  name: "Todolist",

  data() {
    return {
      todoDescription: "", //待办事项描述
      todoList: [], // 所有待办
      todoLength: 0, //剩余待办数量
      open: true
    };
  },

  computed: {
    doneList() {
      console.log("!!")
      return this.todoList.filter(item => item.done)
    },
    
    notDoneList() {
      console.log("!!")
      return this.todoList.filter(item => !item.done)
    }
  },

  methods: {
    // 如果缓存中有，初始化todoList
    initTodoList() {
      const todoStorage = Utils.getItem("todoList");
      if (todoStorage) {
        for (const iterator of todoStorage) {
          if (!iterator.done ) {
            this.todoLength++;
          }
        }

        this.todoList = todoStorage;
      }
    },
    // 添加todo
    addTodoItem() {
      // 如果内容为空则不添加
      if(this.todoDescription == "") {
        return;
      }
      let todoItem = {
        todoDescription: this.todoDescription,
        done: false,
        editing: false
      };
      // 从localstorage中取
      var todoStorage = Utils.getItem("todoList");
      if (todoStorage) {
        todoStorage.push(todoItem);
        Utils.setItem("todoList", todoStorage);
      } else {
        todoStorage = [];
        todoStorage.push(todoItem);
        Utils.setItem("todoList", todoStorage);
      }

      this.todoList.push(todoItem);
      this.todoLength++;
      this.todoDescription = "";
    },
    // 删除todo
    deleteTodoItem(index, done) {
      if (done) {
        this.todoLength--;
      }

      this.todoList.splice(index, 1);
      Utils.setItem("todoList", this.todoList);
    },
    //更改状态
    changeTodoItemStatus(index, done) {
      if (done) {
        // let todoItemTemp = {
        //   todoDescription: this.todoList[index].todoDescription,
        //   done: true
        // };

        this.todoLength--;
        this.todoList[index].done = true;
        // this.todoList.splice(index, 1);
        // this.todoList.push(todoItemTemp);

        Utils.setItem("todoList", this.todoList);
      } else {
        this.todoLength++;
        this.todoList[index].done = false;
        Utils.setItem("todoList", this.todoList);
      }
    },
    // 清空列表
    clearData() {
      localStorage.clear();
      this.todoList = [];
      this.todoLength = 0;
    },

    // 唤起编辑
    getEdit(index) {
      this.todoList[index].editing = true;
    },

    // 保存编辑
    saveEdit(index, event) {
      this.todoList[index].editing = false;
      const editValue = event.target.value;
      // 如果编辑之后内容为空，则删除事项
      if (!editValue.length) {
        this.todoList.splice(index, 1);
      } else {
        this.todoList[index].todoDescription = event.target.value;
        Utils.setItem("todoList", this.todoList);
      }
    }
  },

// 双击编辑待办事项时获取焦点
  directives: {
    "todo-focus": {
      inserted: function (el, binding) {
      
        if (binding.value) {
          el.focus();
        }

      }
    }
  },
// 钩子函数，页面加载完执行
  mounted() {
    this.initTodoList();
  }
};
</script>


<style scoped>

</style>
