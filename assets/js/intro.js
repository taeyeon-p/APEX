/*
 * APEX ASCII Intro
 * 무작위 문자 -> APEX 로고 ASCII 아트 -> APEX 타이틀 순서로 전환되는
 * 부팅/생성 연출. 인수인계 문서 9~21절의 타임라인/문자 매핑 방식을 구현.
 */
(function () {
  "use strict";

  // 최종 ASCII 아트 (사용자 제공 아트웍). 데스크톱/모바일 공통 사용 —
  // 컨테이너의 clamp() 폰트 크기로 화면 폭에 맞춰 자동 축소된다.
  const APEX_ART = [
    "                        --.                       ",
    "                  ,##.      -#=.                  ",
    "               .;@.~==.    ,==~,@;,               ",
    "             :.$,:,  ;-    ~~  ::-!.~             ",
    "           ,:=!,.   !-*    *,    ..=~*.           ",
    "           $;,      *#;    =#    ., ,;=           ",
    "        .!~;  $!.   -.     ;,     *~ ~,#,         ",
    "        ;;:   ,@=   -   ;   ,    ,$~   ~*.        ",
    "       $:~     ..     .=##;       *     :;        ",
    "      *-;     -    .,$$~  ~$,,.          ;$,      ",
    "     ~;;        ,:;;!;  ::  ;**::         ~;-     ",
    "    ,;-     -*==$~-.    ##,   --~===!     .*,     ",
    "    *;,  *@@@,          #~!         ;@@@*  ,@-    ",
    "   -=~   *          =~ !=.@-           @*   ,=    ",
    "   @:    *          =:,$. *=!!!,       @*   ,~!   ",
    "  !..    *          . #@. ::.@@#$      @*    !@   ",
    "  !@     *          =@@:   .@@@@#$-    @*    -.-  ",
    " ,.!     *        .*@@@*:::$@@@@@:.    @=.    @;  ",
    " :$      *        =@@@@@@@@@@$~-~@$    @@~    :.  ",
    "  =    .!*       #@$#@@@@@@@@@@-  ~@   @*      ~: ",
    ".~      :*       #~.$@@@@@@@@@@@#,     @!*.    @: ",
    ".$,    ; *      ~;;=@@@@;:::;@@@@$,    @!:     =. ",
    ".@-    # *     -@$@@@@@@#=   ,*@@@#    @!      .  ",
    ".#-    # *.    *@@@@@@@@@@*    =@@@,   @! #     :.",
    " ;- ~, # *.   :@@@@@=***@@@-    @@@@   @! # ,~  !.",
    " :- @: # *   ;@@@@#~.   -:@=  ~.:@@@;  @* # :@  !.",
    " ;-    # *  ;@@@@,        ;@  ;@.@@@$  @* #     !.",
    " =-    # *   =@#~,~:       =  ;@!@@ *. @* *     ;.",
    ".@-    # *,  ~;:;@:        *  ,#@@@ -; @;.      , ",
    ".#,    , *#    .,,     :.  ,  ,#@@@ ,; @.;.    !  ",
    ".!     .! @            !.     ;@@@@    @ !.    @: ",
    " .!     : @            !~     !@@@@   -@..     =: ",
    " ~#     -,$;          ,$$    ,$@@@@   $~--    !., ",
    " :~       .$          -@~    -@@,@@   $ !     @*  ",
    "  ~$  ,  ; $;         @@,   ,@@#.@~  ;-,  ,  . !  ",
    "  ~ ~,#   ~,=.       ;@@.   #@@,.$, .;~;  ;  :;   ",
    "   =; ,   ,**,      ;@;@.  ;@@! ,;  $;.  :. ~--   ",
    "    -:  .   ,$     :! @:  :@@=  #   =,. -#.  =    ",
    "    !- !..   -@,      @: -@@=     ,*.-  ,. ,;.    ",
    "    ,!! ,,    :#,    ~@: $@!     ,;    !-, !;.    ",
    "     ;-        :#.   $@:~@*     .!     #  =,.     ",
    "      *$.  *;   ,$..  @:##,    *=    ~-  !,*      ",
    "       :!. .;-    **: @;#$   :!!   :  : ;;!       ",
    "        -*  ,, :   -$=@#@, ;=$,    -*~ *::        ",
    "         *,;  $~~     =@@;@#          =.*         ",
    "          *~;,  :, ,    ** , , ; -- -;~;          ",
    "           ~:;;, -.=,;~.. -$ =-;  ~ =;.           ",
    "            .-@~$. , ,-   .* .. .;,$..            ",
    "               :~.@; ....... .=*.#-               ",
    "                 !; -@@#$#@@*.~!                  ",
    "                    -~~-,,~~~.                    "
  ];

  // 문자 밀도 단계 — 희미한 노이즈 -> 진한 노이즈 -> 선명한 ASCII
  const CHARSET_EARLY = ".,:;";
  const CHARSET_MID = ".,:;+=*";
  const CHARSET_LATE = "+=*#%@";

  function pick(charset) {
    return charset[Math.floor(Math.random() * charset.length)];
  }

  /**
   * 최종 ASCII의 각 칸(row, col)을 1:1 대응하는 셀로 관리한다.
   * 공백 칸은 애니메이션하지 않고, 중심에서 먼 칸일수록 늦게 고정된다.
   */
  class ASCIIIntro {
    constructor(element, art, timeline) {
      this.element = element;
      this.art = art;
      this.timeline = timeline;
      this.cells = [];
      this.startTime = null;
      this.finished = false;
      this.rafId = null;
    }

    init() {
      const rows = this.art.length;
      const cols = Math.max.apply(null, this.art.map((r) => r.length));
      const centerRow = (rows - 1) / 2;
      const centerCol = (cols - 1) / 2;
      let maxDist = 0;

      this.cells = [];
      for (let r = 0; r < rows; r++) {
        const rowCells = [];
        const sourceRow = this.art[r];
        for (let c = 0; c < cols; c++) {
          const target = sourceRow[c] || " ";
          const dist = Math.hypot(r - centerRow, c - centerCol);
          if (dist > maxDist) maxDist = dist;
          rowCells.push({
            row: r,
            col: c,
            target: target,
            current: " ",
            dist: dist,
            lockTime: 0
          });
        }
        this.cells.push(rowCells);
      }

      const t = this.timeline;
      for (const row of this.cells) {
        for (const cell of row) {
          if (cell.target === " ") continue;
          const norm = maxDist ? cell.dist / maxDist : 0;
          // 중앙 -> 외곽으로 갈수록 forming~complete 구간 내에서 늦게 고정된다.
          cell.lockTime =
            t.formStart + norm * (t.formEnd - t.formStart) + Math.random() * (t.formEnd - t.formStart) * 0.25;
        }
      }
    }

    charsetFor(elapsed) {
      const t = this.timeline;
      if (elapsed < t.formStart) return CHARSET_EARLY;
      if (elapsed < t.revealStart) return CHARSET_MID;
      return CHARSET_LATE;
    }

    // elapsed 시간 기준으로 모든 셀을 갱신하고 다시 그린다. 전부 고정되면 true.
    update(elapsed) {
      const t = this.timeline;
      let allLocked = true;

      if (elapsed < t.randomizeStart) {
        // INIT — 검은 화면, 아직 아무 문자도 없음
        this.render(true);
        return false;
      }

      const charset = this.charsetFor(elapsed);
      for (const row of this.cells) {
        for (const cell of row) {
          if (cell.target === " ") {
            cell.current = " ";
            continue;
          }
          if (elapsed >= cell.lockTime) {
            cell.current = cell.target;
          } else {
            allLocked = false;
            cell.current = pick(charset);
          }
        }
      }
      this.render(false);
      return allLocked;
    }

    render(blank) {
      if (blank) {
        this.element.textContent = "";
        return;
      }
      const lines = new Array(this.cells.length);
      for (let r = 0; r < this.cells.length; r++) {
        let line = "";
        for (let c = 0; c < this.cells[r].length; c++) {
          line += this.cells[r][c].current;
        }
        lines[r] = line;
      }
      this.element.textContent = lines.join("\n");
    }
  }

  function runIntro() {
    const introEl = document.getElementById("ascii-intro");
    const artEl = document.getElementById("ascii-art");
    const titleEl = document.getElementById("intro-title");
    if (!introEl || !artEl || !titleEl) return;

    const titleSpan = titleEl.querySelector("span");
    const subtitleEl = titleEl.querySelector("small");
    const skipBtn = document.getElementById("skip-intro");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function finishIntro() {
      document.body.classList.remove("intro-locked");
      introEl.classList.add("hidden");
      window.setTimeout(function () {
        introEl.style.display = "none";
      }, 550);
    }

    if (reducedMotion) {
      // 접근성: 애니메이션 감소 설정 시 인트로를 생략하고 바로 본문을 보여준다.
      finishIntro();
      return;
    }

    document.body.classList.add("intro-locked");

    const isMobile = window.innerWidth <= 600;
    const scale = isMobile ? 2800 / 3800 : 1; // 모바일은 약 2.8초로 단축

    const timeline = {
      randomizeStart: 200 * scale,
      noiseStart: 500 * scale,
      formStart: 900 * scale,
      revealStart: 1300 * scale,
      expandStart: 1800 * scale,
      nearComplete: 2400 * scale,
      formEnd: 2700 * scale,
      hold: 2900 * scale,
      title: 3100 * scale,
      subtitle: 3400 * scale,
      enter: 3800 * scale
    };

    const intro = new ASCIIIntro(artEl, APEX_ART, timeline);
    intro.init();

    let titleShown = false;
    let subtitleShown = false;
    let done = false;

    const stageNames = [
      "stage-init",
      "stage-randomize",
      "stage-noise",
      "stage-forming",
      "stage-reveal",
      "stage-expand",
      "stage-near-complete",
      "stage-complete",
      "stage-hold"
    ];

    function setStage(elapsed) {
      let stage = "stage-init";
      if (elapsed >= timeline.formEnd) stage = "stage-complete";
      else if (elapsed >= timeline.nearComplete) stage = "stage-near-complete";
      else if (elapsed >= timeline.expandStart) stage = "stage-expand";
      else if (elapsed >= timeline.revealStart) stage = "stage-reveal";
      else if (elapsed >= timeline.formStart) stage = "stage-forming";
      else if (elapsed >= timeline.noiseStart) stage = "stage-noise";
      else if (elapsed >= timeline.randomizeStart) stage = "stage-randomize";

      if (introEl.dataset.stage !== stage) {
        introEl.classList.remove.apply(introEl.classList, stageNames);
        introEl.classList.add(stage);
        introEl.dataset.stage = stage;
      }
    }

    function animate(time) {
      if (done) return;
      if (!intro.startTime) intro.startTime = time;
      const elapsed = time - intro.startTime;

      setStage(elapsed);
      intro.update(elapsed);

      if (!titleShown && elapsed >= timeline.title) {
        titleEl.classList.add("visible");
        titleShown = true;
      }
      if (!subtitleShown && elapsed >= timeline.subtitle) {
        subtitleEl.classList.add("visible");
        subtitleShown = true;
      }
      if (!done && elapsed >= timeline.enter) {
        done = true;
        finishIntro();
        return;
      }

      intro.rafId = window.requestAnimationFrame(animate);
    }

    intro.rafId = window.requestAnimationFrame(animate);

    if (skipBtn) {
      skipBtn.addEventListener("click", function () {
        if (done) return;
        done = true;
        window.cancelAnimationFrame(intro.rafId);
        finishIntro();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runIntro);
  } else {
    runIntro();
  }
})();
