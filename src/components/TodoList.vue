<template>
  <div>
    <header>
      <img src="../assets/logo.png"/>
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
        <ul>
          <li v-for="(item, index) in todos" :key="index" >
            <div :class="getViewClass(item.done)">
              <input type="checkbox" v-model="item.done" @change="changeTodoItemStatus(item)" />
              <label @dblclick="getEdit(index)">{{item.todoDescription}}</label>
              <a @click="deleteTodoItem(index)" href="javascript:void(0)">✕</a>
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
        <input class="switch-box point" type="checkbox" v-model="open"/>显示已完成
      </span>
      <a @click="clearData()" href="javascript:void(0)">清空</a>
    </footer>
  </div>
</template>

<script>
  import * as Utils from '../utils'

  export default {
  name: 'Todolist',

  data () {
    return {
      todoDescription: '', // 待办事项描述
      todoList: [], // 所有待办
      open: true // 是否显示已完成
    }
  },

  computed: {
    // 根据是否显示已完成事项动态调整list显示
    todos() {
      console.log("111")
      let a = this.open ? this.todoList : this.todoList.filter(todo => !todo.done);
      console.log(a)
      // this.todoList.filter(todo => todo.done === this.open)
      return a;
    },
    // 使用计算属性，就不需要声明属性并维护length的状态
    todoLength() {
      return this.todoList.filter(todo => !todo.done).length;
    }
  },

    watch: {
      todoList: function() {
        Utils.setItem("todoList", this.todoList);
      }
    },

  methods: {
    // 如果缓存中有，初始化todoList
    initTodoList () {
      this.todoList = Utils.getItem("todoList", []);
    },
    // 添加todo
    addTodoItem () {
      // 如果内容为空则不添加
      if (this.todoDescription === '') {
        return
      }
      let todoItem = {
        todoDescription: this.todoDescription,
        done: false,
        editing: false
      }
      // 从localstorage中取
      this.todoList = Utils.getItem('todoList', [])
      this.todoList.push(todoItem)
      this.todoDescription = ''
    },
    // 删除todo
    deleteTodoItem (index) {
      this.todoList.splice(index, 1)
    },
    // 更改状态
    // changeTodoItemStatus (index, done) {
    //
    //   const nowList = this.open ? this.todoList : this.todoList.filter(todo => !todo.done)
    //   console.log(nowList[index].done,index,done)
    //   nowList[index].done = done
    //   this.todoList[index].done = done
    //   Utils.setItem('todoList', this.todoList)
    // },
    changeTodoItemStatus (item) {
      console.log(item)
      console.log(item.done)
    },
    // 清空列表
    clearData () {
      Utils.removeItem('todoList')
      this.todoList = []
    },

    // 唤起编辑
    getEdit (index) {
      this.todoList[index].editing = true
    },

    // 保存编辑
    saveEdit (index, event) {
      this.todoList[index].editing = false
      const editValue = event.target.value
      // 如果编辑之后内容为空，则删除事项
      if (!editValue.length) {
        this.todoList.splice(index, 1)
      } else {
        this.todoList[index].todoDescription = event.target.value
        // watch监听不到这种数组更新，待优化
        Utils.setItem('todoList', this.todoList)
      }
    },

    getViewClass(done) {
      return done ? "view-done" : "view";
    }
  },

  // 双击编辑待办事项时获取焦点
  directives: {
    'todo-focus': {
      inserted: function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }
  },
  // 钩子函数，页面加载完执行
  mounted () {
    this.initTodoList()
  }
}
</script>


<style scoped>

</style>
