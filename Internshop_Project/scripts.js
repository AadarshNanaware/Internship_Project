async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort(arr) {
    let n = arr.length;
    let steps = [];
    steps.push(`Starting Bubble Sort: ${arr.join(', ')}`);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                steps.push(`Swapped ${arr[j]} and ${arr[j + 1]}: ${arr.join(', ')}`);
                updateVisualizer(arr, j, j + 1);
                await sleep(500);
            }
        }
    }
    updateVisualizer(arr, null, null, true);
    return steps;
}

async function insertionSort(arr) {
    let steps = [];
    steps.push(`Starting Insertion Sort: ${arr.join(', ')}`);
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            updateVisualizer(arr, j, j + 1);
            await sleep(500);
            j--;
        }
        arr[j + 1] = key;
        steps.push(`Inserted ${key} at position ${j + 1}: ${arr.join(', ')}`);
        updateVisualizer(arr);
    }
    updateVisualizer(arr, null, null, true);
    return steps;
}

async function selectionSort(arr) {
    let steps = [];
    steps.push(`Starting Selection Sort: ${arr.join(', ')}`);
    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push(`Swapped ${arr[minIdx]} and ${arr[i]}: ${arr.join(', ')}`);
        updateVisualizer(arr, i, minIdx);
        await sleep(500);
    }
    updateVisualizer(arr, null, null, true);
    return steps;
}

async function mergeSort(arr) {
    if (arr.length <= 1) {
        return { sortedArray: arr, steps: [] };
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const { sortedArray: leftSorted, steps: leftSteps } = await mergeSort(left);
    const { sortedArray: rightSorted, steps: rightSteps } = await mergeSort(right);
    const mergeSteps = merge(leftSorted, rightSorted);

    return { sortedArray: mergeSteps, steps: [...leftSteps, ...rightSteps, ...mergeSteps] };
}

function merge(left, right) {
    let result = [], leftIndex = 0, rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

async function quickSort(arr) {
    if (arr.length <= 1) {
        return { sortedArray: arr, steps: [] };
    }

    let pivot = arr[Math.floor(arr.length / 2)];
    let left = arr.filter(x => x < pivot);
    let middle = arr.filter(x => x === pivot);
    let right = arr.filter(x => x > pivot);

    const { sortedArray: leftSorted, steps: leftSteps } = await quickSort(left);
    const { sortedArray: rightSorted, steps: rightSteps } = await quickSort(right);

    const sortedArray = [...leftSorted, ...middle, ...rightSorted];
    const steps = [...leftSteps, `Pivot: ${pivot}, Left: ${leftSorted.join(', ')}, Middle: ${middle.join(', ')}, Right: ${rightSorted.join(', ')}`, ...rightSteps];

    return { sortedArray, steps };
}

async function sortArray() {
    let algorithm = document.getElementById('algorithm').value;
    let input = document.getElementById('inputArray').value;
    let array = input.split(',').map(Number);

    let steps = [];
    let explanation;
    let sortedArray;

    switch (algorithm) {
        case 'bubble':
            steps = await bubbleSort(array.slice()); // Pass a copy of array to sorting functions
            explanation = "Bubble Sort: Repeatedly swaps adjacent elements if they are in the wrong order. This process is repeated until the array is sorted.";
            break;
        case 'insertion':
            steps = await insertionSort(array.slice()); // Pass a copy of array to sorting functions
            explanation = "Insertion Sort: Builds the sorted array one element at a time by comparing each new element with the already sorted elements and inserting it in the correct position.";
            break;
        case 'selection':
            steps = await selectionSort(array.slice()); // Pass a copy of array to sorting functions
            explanation = "Selection Sort: Selects the smallest element from the unsorted portion and swaps it with the first unsorted element. This process is repeated until the entire array is sorted.";
            break;
        case 'merge':
            const { sortedArray: mergeSortedArray, steps: mergeSteps } = await mergeSort(array.slice()); // Pass a copy of array to sorting functions
            sortedArray = mergeSortedArray;
            steps = mergeSteps;
            explanation = "Merge Sort: Divides the array into two halves, recursively sorts each half, and then merges the sorted halves back together.";
            break;
        case 'quick':
            const { sortedArray: quickSortedArray, steps: quickSteps } = await quickSort(array.slice()); // Pass a copy of array to sorting functions
            sortedArray = quickSortedArray;
            steps = quickSteps;
            explanation = "Quick Sort: Selects a pivot element, partitions the array into elements less than the pivot and elements greater than the pivot, and recursively sorts the partitions.";
            break;
        default:
            steps = ["No sorting algorithm selected."];
            explanation = "No sorting algorithm selected.";
    }

    updateSteps(steps);
    document.getElementById('explanation').innerText = explanation;

    if (sortedArray) {
        updateVisualizer(sortedArray, null, null, true);
    }
}

function updateVisualizer(arr, index1 = null, index2 = null, isSorted = false) {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';

    const arrayDiv = document.createElement('div');
    arrayDiv.classList.add('array');

    arr.forEach((value, index) => {
        const element = document.createElement('div');
        element.classList.add('element');
        element.textContent = value;

        // Apply different styles based on the sorting state
        if (isSorted) {
            element.classList.add('sorted');
        } else if (index === index1 || index === index2) {
            element.classList.add(index === index1 ? 'compare' : 'swap');
        }

        arrayDiv.appendChild(element);
    });

    visualizer.appendChild(arrayDiv);
}


function updateSteps(steps) {
    const stepsContainer = document.getElementById('steps');
    stepsContainer.innerHTML = '';
    steps.forEach((step, index) => {
        setTimeout(() => {
            const stepDiv = document.createElement('div');
            stepDiv.textContent = step;
            stepDiv.classList.add('steps-item');
            stepsContainer.appendChild(stepDiv);
        }, index * 500); // Adjust animation speed here (500ms delay)
    });
}
