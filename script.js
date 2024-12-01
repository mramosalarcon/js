// Node:
// npx http-server /path/to/project -o -p 9999
// npx http-server /Users/mramosalarcon/GitHub/CASD_dashboard -o -p 9999

// Python:
// python3 -m http.server
// PHP
// php -S localhost:8000


function createParagraph() {
    const para = document.createElement("p");
    para.textContent = "You clicked the button!";
    document.body.appendChild(para);
  }

  function createtArray() {
    // Prints a simple multidimensional array in
    // JavaScript where we add elements in the array
    // using simple square bracket and push() method
    let salary = [
      ["ABC", 24, 18000],
      ["EFG", 30, 30000],
      ["IJK", 28, 41000],
      ["EFG", 31, 28000],
    ];

    // Prints first array
    console.log("Original array :<br>");
    for (let i = 0; i < salary.length; i++) {
      console.log(salary[i]);
    }

    // Adding "India" at the 4th index of 4th sub array
    salary[3][3] = "India";

    console.log("<br>after adding \"India\" at the 4th array :<br>");
    for (let i = 0; i < salary.length; i++) {
      console.log(salary[i]);
    }

    console.log("<br>after adding \"USA\" and \"Canada\" "
      + "at the 3rd array using \"push()\" method :");
    salary[2].push("USA", "Canada");

    // Adding "USA" and "Canada" in the 2nd sub-array
    // for (let i = 0; i < salary.length; i++) {
    //   console.log(salary[i]);
    // }
  }

  function createtArray2() {
    let activities = [
      ['Work', 9],
      ['Eat', 1],
      ['Commute', 2],
      ['Play Game', 1],
      ['Sleep', 7]
    ];
    activities.push(['Study',2]);
    activities.splice(1, 0, ['Programming', 2]);

    activities.forEach(activity => {
      let percentage = ((activity[1] / 24) * 100).toFixed();
      activity[2] = percentage + '%';
    });
    console.table(activities);

    activities.pop();
    console.table(activities);

    activities.forEach((activity) => {
      activity.pop(2);
    });
  
    console.table(activities);
  }
  const buttons = document.querySelectorAll("button");
  
  for (const button of buttons) {
    button.addEventListener("click", createtArray2);
  }

  