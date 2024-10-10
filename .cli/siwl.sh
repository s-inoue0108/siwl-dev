ACTION=$1
FLAG_1=$2
COMMAND_1=$3
FLAG_2=$4
COMMAND_2=$5

if [ ["$ACTION" = "dev"] && ["$ACTION" = "serve"] ]; then
    pnpm -s run dev
elif [ "$ACTION" = "build" ]; then
    pnpm -s run build
elif [ "$ACTION" = "preview" ]; then
    pnpm -s run preview
elif [ "$ACTION" = "deploy" ]; then
    git switch edit
    git add .
    if ["$FLAG_1" = "-m"]; then
        git commit -m "edit: $COMMAND_1"
    else
        git commit -m ""
    fi
    git push origin edit
    git switch main
    git merge edit
    git push origin main
    git switch edit
fi

pnpm -s run siwl ${ACTION} ${COMMAND_1} ${FILENAME} ${FLAG_2} ${COMMAND_2}
