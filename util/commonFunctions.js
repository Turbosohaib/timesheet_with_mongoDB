export function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

export function formatRecordTime(t) {

    const dateObj = new Date(t);

    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export function calculateTotalSeconds(tasks) {
    const parentTasks = tasks.filter((task) => !task.parentTaskId);
    const updatedTasks = [];
    for (const parentTask of parentTasks) {
        const children = tasks.filter(
            (task) => task.parentTaskId === parentTask._id.$oid
        );
        let totalSeconds = parentTask.seconds || 0;
        for (const child of children) {
            totalSeconds += child.seconds || 0;
        }
        parentTask.totalSeconds = totalSeconds;
        parentTask.totalCount = 1 + children.length;
        updatedTasks.push(parentTask, ...children);
    }
    return updatedTasks;
}

export function unhideCurrentActiveParentChilds() {
    var parent = document.querySelectorAll('.visible');
    for (var i = 0; i < parent.length; i++) {
        var children = parent[i].querySelectorAll('.child');
        for (var j = 0; j < children.length; j++) {
            console.log(children[j].className);
            if (children[j].className.includes('hidden')) {
                children[j].classList.remove('hidden');
            }
        }
    }
}

export default {
    formatTime,
    formatRecordTime,
    calculateTotalSeconds,
    unhideCurrentActiveParentChilds
}