document.addEventListener("DOMContentLoaded", function () {
    var timeTrackRecords = document.querySelector('.time-track-records');

    timeTrackRecords.onclick = (e) => {
        if (e.target.closest('.parent')) {
            var noClickZone = e.target.closest('.noClickZone');
            if (noClickZone != null) {
                return false;
            }
            var parent = e.target.closest('.parent');
            // if (e.currentTarget.className.includes('visible')) {
            //     e.currentTarget.classList.remove('visible');
            // } else {
            //     e.currentTarget.classList.add('visible');
            // }
            var children = parent.querySelectorAll('.child');
            for (var j = 0; j < children.length; j++) {
                if (children[j].className.includes('hidden')) {
                    children[j].classList.remove('hidden');
                } else {
                    children[j].classList.add('hidden');
                }
            }
        }
    }

    /*for (var i = 0; i < parent.length; i++) {
        parent[i].onclick = (e) => {
            console.log('Clock on parent ', e.currentTarget);
            var noClickZone = e.target.closest('.noClickZone');
            if (noClickZone != null) {
                return false;
            }
            if (e.currentTarget.className.includes('visible')) {
                e.currentTarget.classList.remove('visible');
            } else {
                e.currentTarget.classList.add('visible');
            }
            var children = e.currentTarget.querySelectorAll('.child');
            for (var j = 0; j < children.length; j++) {
                if (children[j].className.includes('hidden')) {
                    children[j].classList.remove('hidden');
                } else {
                    children[j].classList.add('hidden');
                }
            }
        }
    }*/
});