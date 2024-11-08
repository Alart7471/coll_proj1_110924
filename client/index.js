import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';

new Vue({
  el: '#app',
  data: {
    page_language: '1',//0 - 'ru', 1 - 'en'
    max_languages: 2,
    lang_data: {
        language: ['Language', 'Язык'],
        title: ['Library System', 'Библиотека'],
        author: ['Author', 'Автор'],
        add_a_book: ['Add a Book', 'Добавить книгу'],
        books_list: ['Books List', 'Список книг'],
        book_title: ['Book Title', 'Название книги'],
        book_author: ['Author', 'Автор'],
        book_actions: ['Actions', 'Действия'],
        book_action_delete: ['Delete', 'Удалить'],
        book_action_edit: ['Edit', 'Редактировать'],
        show_total_time: ['Show Total Usage Time', 'Показать общее время использования книги'],
        for_by: ['by', 'автора'],
        alert_total_time: ['Total usage time', 'Общее время использования книги'],
        alert_total_time_days: ['days', 'дней'],
        alert_req_book_added: ['Book added successfully', 'Книга добавлена успешно'],
        book_show_label: ['Show Book Info', 'Показать информацию о книге'],
        book_add_reader: ['Add Reader', 'Добавить читателя'],
        newReader_title: ['New Reader', 'Новый читатель'],
        newReader_lastName: ['Last Name', 'Фамилия'],
        newReader_days: ['Days', 'Кол-во дней'],
        newReader_confirm: ['Add', 'Добавить'],
        alert_req_reader_added: ['Reader added successfully', 'Читатель добавлен успешно'],
        alert_req_book_deleted: ['Book deleted successfully', 'Книга удалена успешно'],
        alert_req_reader_deleted: ['Reader deleted successfully', 'Читатель удален успешно'],
    },
    error_data: {
        1000: ['Error adding book', 'Ошибка добавления книги'],
        1001: ['Server error', 'Серверная ошибка'],
        1002: ['Error adding reader', 'Ошибка добавления читателя'],
        1003: ['Error getting total usage time', 'Ошибка получения общего времени использования книги'],
        0: ["Title and author are required", "Заполните название и автора"],
        1: ['This book already exists', 'Эта книга уже существует'],
        2: ['Book not found', 'Книга не найдена'],
    },
    books: [],
    newBook: { title: '', author: '' },
    showBookLabel: false,
    bookInLabel: { },
    showReaderLabel: false,
    newReader: {},
    newReaderBookId: '',
  },
  created() {
    this.fetchBooks();
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    })
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await axios
        .get('/api/books')
        .then((response) => {
          this.books = response.data;
        });
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    },
    async addBook() {
        try {
          await axios.post('/api/books', this.newBook, {
            validateStatus: function (status) {
              return status >= 200 && status < 500; 
            },
          })
          .then((response) => {
            switch(response.status){
              case 201:
                alert(this.lang_data.alert_req_book_added[this.page_language]);
                this.newBook = { };
                this.fetchBooks();
                break;
              case 400:
                console.log(response.data.message);
                console.log(this.error_data[Number(response.data.message)][this.page_language])
                alert(this.error_data[Number(response.data.message)][this.page_language]);
                break;
              case 500:
                alert(this.error_data[Number(response.data.message)][this.page_language]);
                break;
            }
          });
        } catch (error) {
          console.error('Error adding book:', error);
        }
    },
    async showTotalTime(bookId) {
      try {
        const response = await axios.get(`/api/books/${bookId}/total-time`);
        alert(`${this.lang_data.alert_total_time[this.page_language]}: ${response.data.totalTime} ${this.lang_data.alert_total_time_days[this.page_language]}`);
      } catch (error) {
        console.error('Error calculating total time:', error);
      }
    },

    changeLang(){
        (this.page_language == 1) ? this.page_language = 0 : this.page_language = 1
    },
    closeModal(){
        if(this.showReaderLabel){
            this.showReaderLabel = false
            this.newReader = {}
            this.newReaderBookId = ''
            return
        }
        if(this.showBookLabel){
            this.showBookLabel = false
            this.bookInLabel = {}
            return
        }
    },
    showReaderModal(bookId){
        if(!this.showBookLabel){return}
        this.showReaderLabel = true
        this.newReaderBookId = bookId
    },
    async addReader(){
        console.log(this.newReader)
        try {
          await axios
          .post(`/api/books/${this.newReaderBookId}/reader`, this.newReader, {
            validateStatus: function (status) {
              return status >= 200 && status < 500; 
            },
          })
          .then(async (response) => {
            switch(response.status){
              case 200:
                alert(this.lang_data.alert_req_reader_added[this.page_language]);
                await this.fetchBooks();
                this.closeModal();
                break;
              case 400:
                console.log(response.data.message);
                alert(this.error_data[Number(response.data.message)][this.page_language]);
                break;
              case 404:
                alert(this.error_data[Number(response.data.message)][this.page_language]);
                break;
              case 500:
                alert(this.error_data[Number(response.data.message)][this.page_language]);
                break;
            }
          });
        } catch (error) {
          console.error('Error adding reader:', error);
        }
    },
    async deleteBook(id){
      try {
        await axios
        .delete(`/api/books/${id}`, {
          validateStatus: function (status) {
            return status >= 200 && status < 500; 
          },
        })
        .then((response) => {
          switch(response.status){
            case 200:
              alert(this.lang_data.alert_req_book_deleted[this.page_language]);
              this.fetchBooks();
              this.closeModal();
              break;
            case 400:
              console.log(response.data.message);
              alert(this.error_data[Number(response.data.message)][this.page_language]);
              break;
            case 404:
              alert(this.error_data[Number(response.data.message)][this.page_language]);
              break;
            case 500:
              alert(this.error_data[Number(response.data.message)][this.page_language]);
              break;
          }
        });
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    },
    async deleteReader(bookId, readerId){
      try {
        await axios
        .delete(`/api/books/${bookId}/reader/${readerId}`, {
          validateStatus: function (status) {
            return status >= 200 && status < 500; 
          },
        })
        .then((response) => {
          switch(response.status){
            case 200:
              alert(this.lang_data.alert_req_reader_deleted[this.page_language]);
              this.fetchBooks();
              this.closeModal();
              break;
            case 400:
              console.log(response.data.message);
              alert(this.error_data[Number(response.data.message)][this.page_language]);
              break;
            case 404:
              alert(this.error_data[Number(response.data.message)][this.page_language]);
              break;
            case 500:
              alert(this.error_data[Number(response.data.message)][this.page_language]);
              break;
          }
        });
      } catch (error) {
        console.error('Error deleting reader:', error);
      }
    },
  }
});
