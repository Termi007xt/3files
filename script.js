let subjects = [];
        let currentSGPA = 0;

        function toggleMode() {
            const body = document.body;
            const toggleBtn = document.getElementById('toggle-btn');
            const isDarkMode = body.classList.toggle('dark-mode');
            if (isDarkMode) {
                toggleBtn.style.setProperty('--icon-content', '"\\1F319"'); 
                document.getElementById('toggle-info').textContent = 'Night owl';
            } else {
                toggleBtn.style.setProperty('--icon-content', '"\\1F31E"'); 
                document.getElementById('toggle-info').textContent = 'Day grind';
            }
        }

        document.getElementById('toggle-btn').style.setProperty('--icon-content', '"\\1F31E"'); 

        function showContent(contentId) {
            document.querySelector('.feature-cards').style.display = 'none';
            const allContent = document.querySelectorAll('.content');
            allContent.forEach(content => content.style.display = 'none');
            const profileAttendanceContainer = document.querySelector('.profile-attendance-container');
            if (profileAttendanceContainer) profileAttendanceContainer.style.display = 'none';

            const selectedContent = document.getElementById(`${contentId}-content`);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                if (contentId === 'profile-customization') {
                    document.getElementById('profile-image').style.display = 'block';
                    document.getElementById('profile-image').style.backgroundImage = "url('https://assets-prd.ignimgs.com/2023/03/27/john-wick-keanu-reeves-more-films-1679912321709.jpeg')";
                    if (profileAttendanceContainer) profileAttendanceContainer.style.display = 'flex';
                }
            }
        }

        function goToHomePage() {
            const allContent = document.querySelectorAll('.content');
            allContent.forEach(content => content.style.display = 'none');
            document.querySelector('.feature-cards').style.display = 'flex';
            document.getElementById('profile-image').style.display = 'none'; 
            document.querySelector('.profile-attendance-container').style.display = 'none';
        }

        function addSubject() {
            const subjectName = document.getElementById('subjectName').value;
            const marks = parseFloat(document.getElementById('marks').value);
            const credits = parseInt(document.getElementById('credits').value);
            if (subjectName && !isNaN(marks) && !isNaN(credits)) {
                subjects.push({ 
                    name: subjectName,
                    marks: marks,
                    credits: credits
                });
                updateSubjectList();
                document.getElementById('subjectName').value = '';
                document.getElementById('marks').value = '';
                document.getElementById('credits').value = '';
            } else {
                alert('Please enter valid values for all fields.');
            }
        }

        function deleteSubject(index) {
            subjects.splice(index, 1);
            updateSubjectList();
        }

        function updateSubjectList() {
            const subjectList = document.getElementById('subjectList');
            subjectList.innerHTML = '';
            subjects.forEach((subject, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'subject-list-item';
                listItem.innerHTML = `${subject.name} - Marks: ${subject.marks}, Credits: ${subject.credits} <button onclick='deleteSubject(${index})' class='calculator-btn'>-</button>`;
                subjectList.appendChild(listItem);
            });
        }

        function calculateSGPA() {
            if (subjects.length === 0) {
                alert('Please add subjects before calculating SGPA.');
                return;
            }
            let totalCredits = 0;
            let weightedSum = 0;
            subjects.forEach(subject => {
                const gradePoint = marksToGradePoint(subject.marks);
                weightedSum += gradePoint * subject.credits;
                totalCredits += subject.credits;
            });
            const sgpa = weightedSum / totalCredits;
            currentSGPA = sgpa; 
            document.getElementById('gpa-output').style.display = 'block';
            document.getElementById('gpa-result').textContent = `SGPA: ${sgpa.toFixed(2)}`;
            document.getElementById('current-sgpa').textContent = sgpa.toFixed(2);
            updateArrowPositions(currentSGPA, parseFloat(document.getElementById('goal-sgpa').value));
        }

        function marksToGradePoint(marks) {
            if (marks >= 90) return 10;
            if (marks >= 80) return 9;
            if (marks >= 70) return 8;
            if (marks >= 60) return 7;
            if (marks >= 50) return 6;
            if (marks >= 40) return 5;
            if (marks >= 30) return 4;
            if (marks >= 20) return 3;
            if (marks >= 10) return 2;
            return 0;
        }

        function compareGoal() {
            const goalSGPA = parseFloat(document.getElementById('goal-sgpa').value);
            const goalMessage = document.getElementById('goal-message');
            if (currentSGPA > goalSGPA) {
                goalMessage.textContent = 'Congratulations! You have surpassed your goal!';
                goalMessage.className = 'goal-message congrats';
            } else if (currentSGPA < goalSGPA) {
                goalMessage.textContent = 'You need to work harder to reach your goal.';
                goalMessage.className = 'goal-message work-harder';
            } else {
                goalMessage.textContent = 'Great job! You have met your goal. Keep pushing forward!';
                goalMessage.className = 'goal-message encouragement';
            }
            updateArrowPositions(currentSGPA, goalSGPA);
        }

        function updateArrowPositions(currentSGPA, goalSGPA) {
            const scaleWidth = document.querySelector('.custom-slider-scale').offsetWidth;
            const currentSGPAPosition = (currentSGPA / 10) * scaleWidth;
            const goalSGPAPosition = (goalSGPA / 10) * scaleWidth;
            document.querySelector('.current-sgpa-arrow').style.left = `${currentSGPAPosition}px`;
            document.querySelector('.goal-sgpa-arrow').style.left = `${goalSGPAPosition}px`;
        }

        document.addEventListener('scroll', function () {
            const scrollY = window.scrollY || window.pageYOffset;
            const bodyHeight = document.body.offsetHeight;
            const windowHeight = window.innerHeight;
            const footer = document.getElementById('footer-container');
            const scrollThreshold = 100;
            if (scrollY + windowHeight >= bodyHeight - scrollThreshold) {
                footer.classList.add('show-footer');
            } else {
                footer.classList.remove('show-footer');
            }
        });

        function addAttendanceRow() {
            const table = document.getElementById('attendanceTable').getElementsByTagName('tbody')[0];
            const newRow = table.insertRow(table.rows.length);
            for (let i = 0; i < 5; i++) {
                const cell = newRow.insertCell(i);
                const input = document.createElement('input');
                input.className = 'attendance-input';
                input.type = i < 2 ? 'text' : 'number';
                cell.appendChild(input);
            }
            const attendancePercentageCell = newRow.insertCell(5);
            attendancePercentageCell.innerHTML = ''; 
            const statusCell = newRow.insertCell(6);
            statusCell.innerHTML = ''; 
            const removeCell = newRow.insertCell(7); 
            if (table.rows.length > 1) { 
                const removeButton = document.createElement('button');
                removeButton.textContent = '-';
                removeButton.style.backgroundColor = 'red';
                removeButton.style.color = 'white';
                removeButton.className = 'attendance-btn'; 
                removeButton.onclick = function() {
                    const row = this.parentNode.parentNode;
                    row.parentNode.removeChild(row);
                };
                removeCell.appendChild(removeButton);
            } else {
                removeCell.innerHTML = '';
            }
        }

        function calculateAttendance() {
            const table = document.getElementById('attendanceTable').getElementsByTagName('tbody')[0];
            for (let i = 0; i < table.rows.length; i++) {
                const row = table.rows[i];
                const classesHeld = parseInt(row.cells[2].getElementsByTagName('input')[0].value);
                const classesAttended = parseInt(row.cells[3].getElementsByTagName('input')[0].value);
                const minPercentage = parseInt(row.cells[4].getElementsByTagName('input')[0].value);
                if (!isNaN(classesHeld) && !isNaN(classesAttended) && !isNaN(minPercentage)) {
                    const currentPercentage = (classesAttended / classesHeld) * 100;
                    row.cells[5].innerText = currentPercentage.toFixed(2) + '%';
                    let status = 0;
                    if (currentPercentage < minPercentage) {
                        while ((classesAttended + status) / (classesHeld + status) * 100 < minPercentage) {
                            status++;
                        }
                        row.cells[6].innerHTML = '<span style="color: red;">-' + status + '</span>';
                    } else {
                        while ((classesAttended - status) / (classesHeld - status) * 100 >= minPercentage && status < classesAttended) {
                            status++;
                        }
                        row.cells[6].innerHTML = '<span style="color: green;">+' + (status - 1) + '</span>';
                    }
                } else {
                    row.cells[5].innerText = '';
                    row.cells[6].innerText = '';
                }
            }
        }

        function addTimeSlot() {
            const timeSlot = document.getElementById('newTimeSlot').value.trim().toLowerCase();
            if (!timeSlot) {
                alert('Please enter a time slot.');
                return; 
            }            
            const headerRow = document.getElementById('timetable').querySelector('thead tr');
            const tableBody = document.getElementById('timetable').querySelectorAll('tbody tr');
            const newHeader = document.createElement('th');
            newHeader.style.position = 'relative';
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.style.position = 'absolute';
            deleteButton.style.right = '5px';
            deleteButton.style.top = '5px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = function() { deleteTimeSlot(newHeader.cellIndex); };
            if (timeSlot === 'break' || timeSlot === 'lunch') {
                newHeader.classList.add('special-time-slot'); 
                newHeader.textContent = timeSlot.toUpperCase().split('').join('\n'); 
                newHeader.appendChild(deleteButton); 
                headerRow.appendChild(newHeader);
                tableBody.forEach(row => {
                    const newCell = row.insertCell();
                    newCell.classList.add('special-time-slot'); 
                });
            } else {
                newHeader.textContent = timeSlot;
                deleteButton.textContent = 'X';
                deleteButton.onclick = function() { deleteTimeSlot(newHeader.cellIndex); };
                newHeader.appendChild(deleteButton);
                headerRow.appendChild(newHeader);
                tableBody.forEach(row => {
                    const newCell = row.insertCell();
                    const inputSubjectDiv = document.createElement('div'); 
                    const inputCodeDiv = document.createElement('div'); 

                    const inputSubject = document.createElement('input');
                    inputSubject.type = 'text';
                    inputSubject.placeholder = 'Subject Name';
                    inputSubject.className = 'timetable-input subject-name';
                    inputSubjectDiv.appendChild(inputSubject);

                    const plusButton = document.createElement('button');
                    plusButton.className = 'attendance-btn attendance-increment';
                    plusButton.textContent = '+';
                    inputSubjectDiv.appendChild(plusButton);

                    const inputCode = document.createElement('input');
                    inputCode.type = 'text';
                    inputCode.placeholder = 'Subject Code';
                    inputCode.className = 'timetable-input subject-code';
                    inputCodeDiv.appendChild(inputCode);

                    const minusButton = document.createElement('button');
                    minusButton.className = 'attendance-btn attendance-decrement';
                    minusButton.textContent = '-';
                    inputCodeDiv.appendChild(minusButton);

                    plusButton.addEventListener('click', () => {
                    const subjectName = inputSubject.value.trim().toLowerCase();
                    const subjectCode = inputCode.value.trim().toLowerCase();
                    incrementAttendance(subjectName, subjectCode);
                });
                minusButton.addEventListener('click', () => {
                    const subjectName = inputSubject.value.trim().toLowerCase();
                    const subjectCode = inputCode.value.trim().toLowerCase();
                    decrementAttendance(subjectName, subjectCode);
                });
                    newCell.appendChild(inputSubjectDiv);
                    newCell.appendChild(inputCodeDiv);
                });
            }
            document.getElementById('newTimeSlot').value = '';
        }

        function deleteTimeSlot(index) {
            if (!confirm('Are you sure you want to delete this time slot?')) return;
            const table = document.getElementById('timetable');
            table.querySelector('thead tr').deleteCell(index);
            Array.from(table.querySelector('tbody').rows).forEach(row => {
                row.deleteCell(index);
            });
        }

        function initializeTimetable() {
            addTimeSlot();
        }

        document.addEventListener('DOMContentLoaded', function() {
        });
        
        function findAttendanceRow(subjectName, subjectCode) {
            const rows = document.getElementById('attendanceTable').querySelectorAll('tbody tr');
            for (const row of rows) {
                const rowSubjectName = row.cells[0].querySelector('input').value.trim().toLowerCase();
                const rowSubjectCode = row.cells[1].querySelector('input').value.trim().toLowerCase();
                if (subjectName === rowSubjectName && subjectCode === rowSubjectCode) {
                    return row;
                }
            }
            return null;
        }

        function incrementAttendance(subjectName, subjectCode) {
            const row = findAttendanceRow(subjectName, subjectCode);
            if (row) {
                const confirmation = confirm(`Attend 1 class for ${subjectName} - ${subjectCode}?`);
                if (confirmation) {
                    const classesHeldInput = row.cells[2].querySelector('input');
                    const classesAttendedInput = row.cells[3].querySelector('input');
                    classesHeldInput.value = parseInt(classesHeldInput.value || '0') + 1;
                    classesAttendedInput.value = parseInt(classesAttendedInput.value || '0') + 1;
                    calculateAttendance(); 
                }
            } else {
                alert("This subject does not exist in the attendance tracker.");
            }
        }

        function decrementAttendance(subjectName, subjectCode) {
            const row = findAttendanceRow(subjectName, subjectCode);
            if (row) {
                const confirmation = confirm(`Bunk 1 class for ${subjectName} - ${subjectCode}?`);
                if (confirmation) {
                    const classesHeldInput = row.cells[2].querySelector('input');
                    classesHeldInput.value = parseInt(classesHeldInput.value || '0') + 1;
                    calculateAttendance();
                }
            } else {
                alert("This subject does not exist in the attendance tracker.");
            }
        }

        function calculateTotalAttendance() {
            const rows = document.getElementById('attendanceTable').querySelectorAll('tbody tr');
            let totalAttended = 0;
            let totalHeld = 0;
            rows.forEach(row => {
                const classesHeld = parseInt(row.cells[2].querySelector('input').value) || 0;
                const classesAttended = parseInt(row.cells[3].querySelector('input').value) || 0;
                totalHeld += classesHeld;
                totalAttended += classesAttended;
            });
            return totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;
        }

        function updateAttendanceDisplay() {
            const totalAttendance = calculateTotalAttendance();
            document.getElementById('current-attendance').textContent = totalAttendance.toFixed(2);
            checkAttendanceGoal(totalAttendance);
        }

        function setAttendanceGoal() {
            const goal = parseFloat(document.getElementById('attendance-goal').value);
            if (isNaN(goal)) {
                alert("Please enter a valid attendance goal.");
                return;
            }
            updateAttendanceDisplay(); 
        }

        function checkAttendanceGoal(totalAttendance) {
            const goal = parseFloat(document.getElementById('attendance-goal').value);
            const message = document.getElementById('attendance-message');
            if (totalAttendance < goal) {
                message.innerHTML = 'You bunked too many classes';
                message.style.color = 'red';
            } else if (totalAttendance > goal) {
                message.innerHTML = 'You have good attendance';
                message.style.color = 'green';
            } else {
                message.innerHTML = 'You have just enough attendance';
                message.style.color = 'blue';
            }
            if (totalAttendance < 10) {
                message.innerHTML = 'Happy NSAR';
                message.style.color = 'red';
            } else if (totalAttendance === 100) {
                message.innerHTML = 'You are a nerd';
                message.style.color = 'rgb(204, 153, 0)';
            }
        }

        document.getElementById('addTaskBtn').addEventListener('click', function() {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'task-input-container'; 
            const taskInput = document.createElement('input'); 
            taskInput.type = 'text';
            taskInput.className = 'task-input'; 
            taskInput.placeholder = 'Enter a new task...';            
            const addTaskBtn = document.createElement('button'); 
            addTaskBtn.textContent = 'Add';
            addTaskBtn.className = 'add-task-btn'; 
            addTaskBtn.onclick = function() {
                if (taskInput.value.trim() !== '') {
                    addTask(taskInput.value); 
                    inputDiv.remove(); 
                }
            };            
            inputDiv.appendChild(taskInput);
            inputDiv.appendChild(addTaskBtn);
            document.getElementById('todo-content').appendChild(inputDiv);
            taskInput.focus(); 
        });

        function addTask(text) {
            const taskContainer = document.getElementById('tasksContainer');
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-container';
            const taskText = document.createElement('div');
            taskText.className = 'task';
            taskText.textContent = text;
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Complete';
            completeBtn.className = 'complete-btn';
            completeBtn.addEventListener('click', function() {
                taskText.style.textDecoration = 'line-through';
            });
            let holdTimeout;
            completeBtn.addEventListener('mousedown', function() {
                completeBtn.classList.add('active');
                holdTimeout = setTimeout(function() {
                    taskContainer.removeChild(taskDiv);
                }, 2000);
            });
            completeBtn.addEventListener('mouseup', function() {
                clearTimeout(holdTimeout);
                completeBtn.classList.remove('active');
            });
            completeBtn.addEventListener('mouseleave', function() {
                clearTimeout(holdTimeout);
                completeBtn.classList.remove('active');
            });
            taskDiv.appendChild(taskText);
            taskDiv.appendChild(completeBtn);
            taskContainer.appendChild(taskDiv);
        }