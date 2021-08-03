## Khóa Luận Tốt Nghiệp
# Đề tài: Xây dựng Website và ứng dụng Mobile dạy học trực tuyến
### Sinh viên thực hiện:
 - Trần Ngọc Hùng - 17110157
 - Châu Huỳnh Phước Toàn - 17110240
### Các công nghệ chính:
 <img src="https://tecnoinfluencia.com/images/skill/angular.png"><img src="https://img.stackshare.io/service/11331/asp.net-core.png"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPw7e1oXI5SnkykpcQkyJR2ymbSMs0XS4dDuZojsvzV0rNP6k6nLkrLpMD0PMXVltIMxk&usqp=CAU"><img src="https://blog.sqlauthority.com/wp-content/uploads/2008/12/ssms.png">
### Dịch vụ tích hợp
 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuE9FuOXpXVrii1YRbxD8QPtuMM75Fgd08e2OUooIKkpNl0uzLpmpt9H_IIBYeOctUSic&usqp=CAU" with=250 height=250><img src="https://uploads-ssl.webflow.com/604f786ed522e2678a3bfa51/60a100f7f6a610373446f9fb_PayPal.png">
### Môi trường cần cài đặt 
 - [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
 - [AngularCLI](https://angular.io/)
 - [NodeJS](https://nodejs.org/en/)
 - [React Native CLI](https://reactnative.dev/docs/environment-setup)
 - [Nodemon](https://nodemon.io/)
### Ứng dụng cần cài đặt
 - [Visual Studio](https://visualstudio.microsoft.com/downloads/)
 - [MS SQLServer](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
 - [Android Studio](https://developer.android.com/studio)
 - [Code Editor(Visual Studio Code,Notepad++,Sublime Text,etc)](https://codelearn.io/sharing/top-10-code-editor-chat-cho-coder-nam-2020)
### Lưu ý cài đặt
 - Cần cài đặt **Nodejs** và **npm** đầu tiên để install các package cho project, kiểm tra lần lượt các dịch vụ này thông qua các lệnh ```node -v```, ```npm -v``` tại cửa sổ command prompt (hoặc PowerShell)
 - Với các project Angular và React Native khi mở lần đầu tiên cần sử dụng lệnh ```npm install``` để đảm bảo cài đặt đầy đủ dependencies, kiểm tra xem file nodemodule đã tồn tại hay chưa
 - Backend cần chú ý thay đổi tại file **appsettings.json**: ```"ConnectionStrings": {
    "DatabaseConnection": "Server=(localhost);Database=CourseDB3;Trusted_Connection=True;MultipleActiveResultSets=True;"
  }```
 với Server là tên Server name tại SSMS, thực hiện lệnh ```EntityFrameworkCore\Add-Migration``` và ```EntityFrameworkCore\Update-Database``` tại cửa sổ Package Manager Console để cập nhật cơ sở dữ liệu.
 - Trong quá trình cài đặt Angular CLI nếu gặp vấn đề tương tự như sau:
  <img src="https://i.stack.imgur.com/WE29s.png" with=250 height=250>
 có thể tham khảo link [Stackoverflow](https://stackoverflow.com/questions/47670693/not-able-to-install-angular-cli-using-npm) để khắc phục
 
